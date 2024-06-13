import path from 'path';

import glob from 'fast-glob';
import fs from 'fs-extra';

import type { Options as GlobOptions } from 'fast-glob';

/**
 * Optional parameters for the merge json utility
 */
export type MergeJsonOptions = {
  /** File paths to the json file to merge */
  filesToMerge?: string[];
  /** Glob pattern for finding json to merge */
  pattern?: string;
  /** Path to the working directory from where to glob */
  cwd?: string;
  /** Path to the output file once merged (defaults to cwd/merges-timestamp.json */
  output?: string;
  /** Optional glob options */
  globOptions?: GlobOptions;
  /** to minify the merged json or not */
  minify?: boolean;
};

/**
 * Utility function to merge several json files into one single json file.
 * @param options
 */
export const mergeJson = async (options: MergeJsonOptions): Promise<{ files: string[]; output: string; merged: string }> => {
  const { filesToMerge, pattern, cwd, globOptions, minify, output } = {
    cwd: process.cwd(),
    output: `${process.cwd()}/merged-json-${new Date().toISOString()}.json`,
    globOptions: {},
    minify: true,
    ...options,
  };

  let files = [];
  if (pattern) {
    files = await glob(pattern, {
      cwd,
      ignore: ['**/*.!(json)'],
      absolute: true,
      ...globOptions,
    });
  } else {
    if (!filesToMerge) throw new Error('Pattern or at least 1 file path required.');
    files = filesToMerge.map(file => (path.isAbsolute(file) ? file : path.resolve(cwd, file)));
  }

  const filesPromises = files.map(async filePath => {
    const fileExists = fs.existsSync(filePath);

    if (!fileExists) throw new Error(`File does not exist: ${filePath}`);

    // read json
    console.debug('Reading file:', filePath);
    const jsonStr = await fs.promises.readFile(filePath, 'utf-8');

    console.debug('File read successfully:', filePath);
    return JSON.parse(jsonStr);
  });

  const f = await Promise.all(filesPromises);
  const merged = f.reduce((acc, val) => Object.assign(acc, val));

  const spaces = minify ? 0 : 2;

  console.debug('Writing merge json at:', output);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeJsonSync(output, merged, { spaces });
  return { files, output, merged };
};

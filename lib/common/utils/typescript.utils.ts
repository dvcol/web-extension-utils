/**
 * Returns a class implementing all the properties of the provided type
 */
export const autoImplement = <T>(): new () => T => class {} as any;

/**
 * Decorator to make a class implement an interface with static methods instead of instances
 */
export const staticImplements =
  <T>() =>
  <U extends T>(constructor: U) => {
    // eslint-disable-next-line no-unused-expressions
    constructor;
  };

/**
 * Extends Partial to make all own properties also Partial
 */
export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]> | T[P];
};

export type RequireAtLeastOne<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>;
}[keyof T];

export type ExclusiveUnion<T> = {
  [K in keyof T]: { [P in K]: T[K] };
}[keyof T];

export type Primitive = string | boolean | number;
export type PrimitiveRecord = Record<string, Primitive>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- generic typing
export type RecursiveRecord<T = any> =
  | {
      [key: string]: T | RecursiveRecord<T>;
    }
  | Record<string, never>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- generic typing
export type GenericFunction = (...args: any) => any;

export type ArrayElement<ArrayType extends readonly unknown[] | undefined> = ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export type RecursiveType<T, R> = {
  [K in keyof T]: T[K] extends object ? RecursiveType<T[K], R> : R;
};

export type Mutable<T> = { -readonly [P in keyof T]: T[P] };

# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.7.1](https://github.com/dvcol/web-extension-utils/compare/v1.7.0...v1.7.1) (2023-03-12)


### Bug Fixes

* **type:** fix HttpParameters to include Blobs ([529bd3a](https://github.com/dvcol/web-extension-utils/commit/529bd3a9f3871f3a78b5fe7072f449ce83abc56d))

## [1.7.0](https://github.com/dvcol/web-extension-utils/compare/v1.6.2...v1.7.0) (2023-03-09)


### Features

* **logger:** adds proxy logger to control log level from outside ([df517db](https://github.com/dvcol/web-extension-utils/commit/df517dbe25e9c07c52fdf65e83b599c7cf81dcf5))

### [1.6.2](https://github.com/dvcol/web-extension-utils/compare/v1.6.1...v1.6.2) (2023-03-08)


### Bug Fixes

* **http:** fix rxFetch destructuring ([20a9e74](https://github.com/dvcol/web-extension-utils/commit/20a9e746e3309ea73517d0f219e66df0ed7c66d3))

### [1.6.1](https://github.com/dvcol/web-extension-utils/compare/v1.6.0...v1.6.1) (2023-03-08)


### Bug Fixes

* **storage:** fix storage clear in function call ([607c8dc](https://github.com/dvcol/web-extension-utils/commit/607c8dca26be4f11701aae09a72a77e620e39771))

## [1.6.0](https://github.com/dvcol/web-extension-utils/compare/v1.5.1...v1.6.0) (2023-03-08)


### Features

* **storage:** add storage clear methods ([0f04c3e](https://github.com/dvcol/web-extension-utils/commit/0f04c3e05e6e92e49ad77c4ddf105d15e2874c6e))

### [1.5.1](https://github.com/dvcol/web-extension-utils/compare/v1.5.0...v1.5.1) (2023-03-07)


### Bug Fixes

* **storage:** fix empty getter/setter ([67691b2](https://github.com/dvcol/web-extension-utils/commit/67691b2515f8e8dac5afeecab8088e408be000b0))

## [1.5.0](https://github.com/dvcol/web-extension-utils/compare/v1.4.0...v1.5.0) (2023-03-07)


### Features

* **storage:** adds onChange wrappers ([e4fefdb](https://github.com/dvcol/web-extension-utils/commit/e4fefdb314c3febb587cdf3fd94d2bd8ee38da58))

## [1.4.0](https://github.com/dvcol/web-extension-utils/compare/v1.3.1...v1.4.0) (2023-03-07)


### Features

* **storage:** allow for raw storage access ([d59c8d2](https://github.com/dvcol/web-extension-utils/commit/d59c8d201c2dc7d6c5c57696f086de7da904f911))

### [1.3.1](https://github.com/dvcol/web-extension-utils/compare/v1.3.0...v1.3.1) (2023-03-06)


### Bug Fixes

* **extension:** exclude chrome store from script injection ([162f785](https://github.com/dvcol/web-extension-utils/commit/162f78564498ef37285d3e989e6ad7477dd95fb9))

## [1.3.0](https://github.com/dvcol/web-extension-utils/compare/v1.2.0...v1.3.0) (2023-03-05)


### Features

* **scripts:** add script injection API ([fd1251e](https://github.com/dvcol/web-extension-utils/commit/fd1251eb664038ab7e6a2233bdf058b1799bb5bd))

## [1.2.0](https://github.com/dvcol/web-extension-utils/compare/v1.1.1...v1.2.0) (2023-03-05)


### Features

* **downloads:** adds wrapper for downloads API ([6690761](https://github.com/dvcol/web-extension-utils/commit/66907616f36ca6849a00d07826e64d39f2033b4d))
* **extension:** adds wrapper for extension API ([5f32ec5](https://github.com/dvcol/web-extension-utils/commit/5f32ec52595466f7c224d1c4bc4e64b4557f2441))
* **tabs:** adds wrapper for tabs API ([99123b8](https://github.com/dvcol/web-extension-utils/commit/99123b89e827b1d46f0f117955719bd092ce692c))


### Bug Fixes

* **build:** clean up doc, lint and deps ([f933fd8](https://github.com/dvcol/web-extension-utils/commit/f933fd8f3732a8a58304c8955e9231c0317b8785))

## [1.1.1](https://github.com/dvcol/web-extension-utils/compare/v1.0.3...v1.1.0) (2022-05-01)


### Features

* **http:** add fetch rxjs wrapper ([0bf9346](https://github.com/dvcol/web-extension-utils/commit/0bf9346b19daf6ffdeecb305b7ec7475f467b4c3))

### [1.0.3](https://github.com/dvcol/web-extension-utils/compare/v1.0.2...v1.0.3) (2022-04-18)


### Bug Fixes

* **context:** strip on click before update ([acd6074](https://github.com/dvcol/web-extension-utils/commit/acd60740b2168f7c913a779399c0929a5cef4c3d))

### [1.0.2](https://github.com/dvcol/web-extension-utils/compare/v1.0.1...v1.0.2) (2022-04-18)


### Bug Fixes

* **ci:** fixes release changelog ([6ded7e8](https://github.com/dvcol/web-extension-utils/commit/6ded7e87f739e9e334606873a80eb2af5bfcc614))
* **context:** allow save override when building array of options ([58c8adb](https://github.com/dvcol/web-extension-utils/commit/58c8adb93d1889a78848dc061cf49f1b9cc44a54))

### [1.0.1](https://github.com/dvcol/web-extension-utils/compare/v1.0.0...v1.0.1) (2022-04-18)


### Bug Fixes

* **build:** fixes package.json esm/cjs declaration ([d36f9bd](https://github.com/dvcol/web-extension-utils/commit/d36f9bd5d3c4883b0c37f993b8d977f4f1d4da57))

## 1.0.0 (2022-04-18)


### Features

* **initial:** initial commit ([528a23b](https://github.com/dvcol/web-extension-utils/commit/528a23bf6c699a2db547e626e60138582f4ca977))

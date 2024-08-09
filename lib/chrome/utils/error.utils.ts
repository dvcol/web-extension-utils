export const ExtensionErrorTypes = {
  ApiUnavailableError: 'ApiUnavailableError',
};

export class ApiUnavailableError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = ExtensionErrorTypes.ApiUnavailableError;
  }
}

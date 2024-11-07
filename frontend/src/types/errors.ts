export class RefreshTokenExpiredError extends Error {
  constructor() {
    super("Refresh Token expirou");
  }
}

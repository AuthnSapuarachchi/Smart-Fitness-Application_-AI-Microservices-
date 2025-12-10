export const authConfig = {
  clientId: "oauth2-pkce-client
",
  authorizationEndpoint: "https://myAuthProvider.com/auth",
  tokenEndpoint: "https://myAuthProvider.com/token",
  redirectUri: "http://localhost:3000/",
  scope: "someScope openid",
  onRefreshTokenExpire: (event: TRefreshTokenExpiredEvent) =>
    event.logIn(undefined, undefined, "popup"),
};

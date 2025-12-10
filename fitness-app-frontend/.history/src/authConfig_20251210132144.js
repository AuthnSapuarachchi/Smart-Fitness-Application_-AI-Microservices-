export const authConfig = {
  clientId: "oauth2-pkce-client",
  authorizationEndpoint:
    "http://localhost:8181/realms/fitness-oAuth2/protocol/openid-connect/auth",
  tokenEndpoint: "https://myAuthProvider.com/token",
  redirectUri: "http://localhost:3000/",
  scope: "someScope openid",
  onRefreshTokenExpire: (event: TRefreshTokenExpiredEvent) =>
    event.logIn(undefined, undefined, "popup"),
};

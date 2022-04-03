import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Reference
// Refresh token authorization: https://next-auth.js.org/tutorials/refresh-token-rotation

const GOOGLE_AUTHORIZATION_URL =
  "https://accounts.google.com/o/oauth2/auth" +
  new URLSearchParams({
    prompt: "consent",
    access_type: "offline",
    response_type: "code",
  });

async function refreshAccessToken(token: any) {
  try {
    const url =
      "https://oauth2.googleapis.com/token?" +
      new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID || "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      });

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });

    const refreshedToken = await response.json();

    if (!response.ok) {
      throw refreshedToken;
    }

    return {
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000,
      refreshToken: refreshedToken.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.log(error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: GOOGLE_AUTHORIZATION_URL,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn() {
      return "/";
    },
    async session({ session, token }: any) {
      // depending on provider you can add additional information to the session. ie. images, email, etc.
      session.user.name = token.user.name;
      session.user.email = token.user.email;
      return session;
    },
    async jwt({ token, user, account }: any) {
      // initial sign in this just means this is their first time signing in.
      if (account && user) {
        return {
          accessToken: account.access_token,
          accessTokenExpires: Date.now() + account.expires_in * 1000,
          refreshToken: account.refresh_token,
          user,
        };
      }

      // return previous token if it has not expired
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      //access token has expired, run function to refresh token
      return refreshAccessToken(token);
    },
  },
});

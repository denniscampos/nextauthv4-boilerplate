# NextAuth v4 Boilerplate

Google Provider is used, but you can use whatever provider you see fit your needs.

To configure your providers:
`pages/api/auth/[...nextauth].ts`

Basic login page - visit:
`http://localhost:3000/login`

Create your ID & Secret by visiting:
https://console.cloud.google.com/apis/credentials

Install dependencies
`npm install` or `yarn`

Create `.env.local` file or look at `.env.local.sample`

Add the following:
| Env Name | Variable |
| ----------- | ----------- |
| NEXTAUTH_URL | http://localhost:3000 |
| JWT_SECRET | extremely_secret_token |
| GOOGLE_CLIENT_ID | |
| GOOGLE_CLIENT_SECRET | |

If you are using a DB like Prisma/Postgres you can add an adapter to your configuration.

Example:
`adapter: PrismaAdapter(prisma)`
Other DB Adapters: https://next-auth.js.org/adapters/overview

Refer to the documentation to set up different providers:
https://next-auth.js.org/

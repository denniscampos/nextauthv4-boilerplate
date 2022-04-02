import { signIn, signOut, useSession } from "next-auth/react";

export default function Login() {
  const { data: session } = useSession();

  console.log(session);

  const handleSignin = (e: React.SyntheticEvent) => {
    e.preventDefault();
    signIn();
  };
  const handleSignout = (e: React.SyntheticEvent) => {
    e.preventDefault();
    signOut();
  };

  if (session) {
    return (
      <div>
        {session ? (
          <>
            <h1>Welcome {session?.user?.email} </h1>
            <button onClick={handleSignout}>Signout</button>
          </>
        ) : null}
      </div>
    );
  }

  return (
    <div>
      <h3>Please Sign In</h3>
      <button onClick={handleSignin}>Sign in</button>
    </div>
  );
}

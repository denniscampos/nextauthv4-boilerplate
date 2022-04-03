import { signIn, getProviders } from "next-auth/react";
import { GetServerSideProps } from "next";

interface ProviderProps {
  providers: ProviderProps[];
  id: string;
  name: string;
  signInUrl: string;
  type: string;
}

export default function Login({ providers }: ProviderProps) {
  return (
    <div>
      <h3>Welcome</h3>
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button onClick={() => signIn("google", { callbackUrl: "/" })}>
            Sign in with {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  };
};

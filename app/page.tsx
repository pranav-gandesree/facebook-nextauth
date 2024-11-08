import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import Signout from "./components/Signout";
import Link from "next/link";

async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <>
      <div>
        <h1>Hi from Next.js Testing</h1>
      </div>
      <div>
        {session?.user?.name ? (
          <p>Welcome, {session.user.name}!</p>
        ) : (
          <p>You are not signed in.</p>
        )}
      </div>
      {!session && (
        <Link href="/auth/signin">
          <button className="px-4 py-2 bg-blue-500 text-white rounded">
            Sign In
          </button>
        </Link>
      )}
      {session && <Signout />}
    </>
  );
}

export default Home;

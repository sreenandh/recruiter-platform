import Link from "next/link";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="container">
      <h1>Recruiter Platform</h1>
      <p className="row" style={{ color: "#666" }}>
        Core CRUD, AI match suggestions, and PDF resume parsing.
      </p>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <div className="row" style={{ gap: 16 }}>
          <Link href="/candidates">Candidates</Link>
          <Link href="/roles">Roles</Link>
          <Link href="/matches">Matches</Link>
          <Link href="/admin">Admin</Link>
        </div>
      </SignedIn>
    </div>
  );
}
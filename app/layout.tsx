import { ClerkProvider, SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <header style={{ padding: 10, borderBottom: "1px solid #ccc", display: "flex", gap: 10 }}>
            <SignedOut>
              <SignInButton />
              <SignUpButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>
          <main style={{ padding: 20, maxWidth: 1000, margin: "0 auto" }}>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
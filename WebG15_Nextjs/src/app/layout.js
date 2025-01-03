import Navbar from "../components/Navbar";
import "../styles/globals.css";
import Head from "next/head"; // Import Head from next/head
import { AuthProvider } from "../context/AuthContext";

export const metadata = {
  title: "AlefBet",
  description: "Learn Hebrew with AlefBet",
};

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
    <html lang="en">
      <Head>
        <link rel="icon" href="../../public/favicon.ico/" />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Head>
      <body className="h-screen bg-gray-100 dark:bg-slate-900 text-black dark:text-white flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto p-8">{children}</main>
        <footer className="text-center py-4">
          <p>© 2024 AlefBet. All rights reserved.</p>
        </footer>
      </body>
    </html>
    </AuthProvider>
  );
}

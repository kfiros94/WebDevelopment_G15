import Navbar from "../components/Navbar"
import "../styles/globals.css"
import Head from "next/head" // Import Head from next/head for adding metadata
import { AuthProvider } from "../context/AuthContext"

/**
 * Metadata for the application, used in the <Head> section.
 */
export const metadata = {
    title: "AlefBet",
    description: "Learn Hebrew with AlefBet",
}

/**
 * RootLayout
 *
 * This component wraps your entire Next.js application layout,
 * providing a consistent navbar, footer, metadata in <Head>,
 * and an AuthProvider for managing authentication state.
 */
export default function RootLayout({ children }) {
    return (
        /**
         * AuthProvider:
         * Wraps the entire application so any component can access user/auth data.
         */
        <AuthProvider>
            <html lang="en">
                {/* 
          <Head> from next/head allows you to define page metadata 
          like title, icons, meta tags, etc. 
        */}
                <Head>
                    <link rel="icon" href="../../public/favicon.ico/" />
                    <title>{metadata.title}</title>
                    <meta name="description" content={metadata.description} />
                </Head>

                {/* 
          The body sets global text color, background color,
          and also includes a Navbar at the top and a footer at the bottom.
        */}
                <body className="h-screen bg-gray-100 dark:bg-slate-900 text-black dark:text-white flex flex-col">
                    <Navbar />
                    {/* 
            The main container for the page’s children content,
            using Tailwind utility classes for spacing & layout.
          */}
                    <main className="flex-1 container mx-auto p-8">{children}</main>
                    {/* Footer with simple text */}
                    <footer className="text-center py-4">
                        <p>© 2024 AlefBet. All rights reserved.</p>
                    </footer>
                </body>
            </html>
        </AuthProvider>
    )
}

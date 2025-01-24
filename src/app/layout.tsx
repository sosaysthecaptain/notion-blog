import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import './globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Marc Auger - Hardware & Software Projects',
  description: 'Personal website and blog of Marc Auger, featuring hardware and software projects',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="page-container">
        <div className="content-wrapper">
          <Navigation />
          <main className="max-w-5xl mx-auto px-4">
            {children}
          </main>
        </div>
        <Footer />
      </body>
    </html>
  )
}
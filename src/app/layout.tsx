import Navigation from '@/components/Navigation'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <main className="max-w-5xl mx-auto px-4 pb-16">
          {children}
        </main>
      </body>
    </html>
  )
}
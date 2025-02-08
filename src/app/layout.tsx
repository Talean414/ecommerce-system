import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import { ThemeProvider } from '@/contexts/ThemeContext' // Import ThemeProvider
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'E-Commerce System',
  description: 'An award-winning e-commerce system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider> 
          <Providers>
            {children}
            <Toaster />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}

import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata = {
  title: "TravelMatch - Descubra Destinos Únicos",
  description: "Descubra destinos incríveis através da análise inteligente de suas fotografias",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`dark ${inter.variable}`}>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  )
}

'use client'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import WebSocketProvider from "./websocket_provider";

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <WebSocketProvider>
        <html lang="en">
        <body className={inter.className}>{children}</body>
        </html>
      </WebSocketProvider>

  )
}

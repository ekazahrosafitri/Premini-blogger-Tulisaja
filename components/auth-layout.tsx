import type React from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="auth-page">
      <div className="auth-back-link">
        <Link href="/">
          <ArrowLeft size={20} /> Kembali ke Beranda
        </Link>
      </div>
      <div className="auth-forms">{children}</div>
    </div>
  )
}


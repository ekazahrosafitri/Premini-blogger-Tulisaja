"use client"
import { useState } from "react"
import type React from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import AuthLayout from "@/components/auth-layout"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically handle authentication
    console.log("Login data:", formData)

    // For demo purposes, just redirect to home
    router.push("/")
  }

  return (
    <AuthLayout>
      <div className="auth-forms-container">
        <h2>Masuk ke Akun Anda</h2>
        <form onSubmit={handleSubmit} className="auth-form active">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              placeholder="Masukkan email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Kata Sandi
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              placeholder="Masukkan kata sandi"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="form-submit">
            Masuk
          </button>
          <div className="form-footer">
            Belum punya akun? <Link href="/register">Daftar di sini</Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  )
}


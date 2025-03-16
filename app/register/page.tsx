"use client"
import { useState } from "react"
import type React from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import AuthLayout from "@/components/auth-layout"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
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
    // Here you would typically handle registration
    console.log("Registration data:", formData)

    // For demo purposes, just redirect to login
    router.push("/login")
  }

  return (
    <AuthLayout>
      <div className="auth-forms-container">
        <h2>Buat Akun Baru</h2>
        <form onSubmit={handleSubmit} className="auth-form active">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Nama Lengkap
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-input"
              placeholder="Masukkan nama lengkap"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
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
            Daftar
          </button>
          <div className="form-footer">
            Sudah punya akun? <Link href="/login">Masuk di sini</Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  )
}


"use client"
import { useState, useEffect } from "react"
import type React from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import AuthLayout from "@/components/auth-layout"
import { Register } from "@/lib/Authenticate"
import { useAuth } from "@/lib/useAuth"
import Loading from "@/components/ui/Loading"

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordconfirmation: ""
  })
  const {user, loading} = useAuth();
  const [loadingPage, setLoadingPage] = useState(true);

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }

    if(!loading) {
      setLoadingPage(false)
    }
  }, [user, router, loading]);

  if(loadingPage) {
    return <Loading text="Memuat..."/>
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if(formData.password != formData.passwordconfirmation) {
      setError("Kata sandi tidak sama");
      return;
    }
    
    const register = await Register(formData);

    if(!register.status || !register.success) {
      setError(register.pesan || register.message);
    }

    if(register.status || register.success) {
      setSuccess(register.pesan || register.message)
      router.push('/login');
    }
  }

  return (
    <AuthLayout>
      <div className="auth-forms-container">
        <h2>Buat Akun Baru</h2>
        <p className="mb-2 text-red-500 text-center">{error}</p>
        <p className="mb-2 text-green-500 text-center">{success}</p>
        <form onSubmit={handleSubmit} className="auth-form active">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Nama Lengkap
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-input bg-gray-800"
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
              className="form-input bg-gray-800"
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
              className="form-input bg-gray-800"
              placeholder="Masukkan kata sandi"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="passwordconfirmation" className="form-label">
              Kata Sandi
            </label>
            <input
              type="password"
              id="passwordconfirmation"
              name="passwordconfirmation"
              className="form-input bg-gray-800"
              placeholder="Masukkan kata sandi"
              value={formData.passwordconfirmation}
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


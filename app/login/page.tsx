"use client"
import { useState, useEffect } from "react"
import type React from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import AuthLayout from "@/components/auth-layout"
import { Login } from "@/lib/Authenticate"
import { useAuth } from "@/lib/useAuth"
import Loading, { LoadingCircle } from "@/components/ui/Loading"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const {user, loading} = useAuth();
  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingAuth, setLoadingAuth] = useState(false);

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
    setLoadingAuth(true);
    
    const login = await Login(formData);
    if(login.status == false || !login.success == false) {
      setError(login.pesan || login.message);
    }

    if(login.status == true || login.success == true) {
      // setSuccess(login.pesan || login.message)
      setSuccess("Masuk Berhasil Tunggu...Sedang Prosess")
      router.push('/dashboard');
    }

    setLoadingAuth(false);

  }

  return (
    <AuthLayout>
      <div className="auth-forms-container">
        <h2>Masuk ke Akun Anda</h2>
        <p className="mb-2 text-red-500 text-center">{error}</p>
        <p className="mb-2 text-green-500 text-center">{success}</p>
        <form onSubmit={handleSubmit} className="auth-form active">
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
          <button disabled={loadingAuth} type="submit" className="form-submit flex justify-center gap-2">
            {loadingAuth && <LoadingCircle/>} Masuk
          </button>
          <div className="form-footer">
            Belum punya akun? <Link href="/register">Daftar di sini</Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  )
}


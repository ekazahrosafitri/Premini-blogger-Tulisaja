"use client"

import { useState } from "react"
import Image from "next/image"

export default function DashboardContent() {
  const [userData] = useState({
    name: "Adriana",
    fullName: "Adriana O'Sullivan",
    avatar: "https://storage.googleapis.com/a1aa/image/deeez8XSP-wG0MRgR3Jyex8rjeddJbQezOZ0dkDN-cQ.jpg",
  })

  const [stats] = useState({
    totalPosts: 150,
    totalReaders: 8816,
  })

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Welcome back, {userData.name}</h1>
          <p className="dashboard-subtitle">Here's an overview of your blog traffic and recent activities.</p>
        </div>
        <div className="user-profile">
          <span>{userData.fullName}</span>
          <div className="avatar-container">
            <Image
              src={userData.avatar || "/placeholder.svg"}
              alt="User avatar"
              width={40}
              height={40}
              className="avatar-image"
            />
          </div>
        </div>
      </div>
      <div className="stats-grid">
        <div className="stats-card">
          <h2 className="stats-title">Total Blog Posts</h2>
          <p className="stats-value">{stats.totalPosts}</p>
        </div>
        <div className="stats-card">
          <h2 className="stats-title">Total Article Readers</h2>
          <p className="stats-value">{stats.totalReaders.toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}


"use client"
import { useState } from "react"
import type React from "react"

import Image from "next/image"

export default function EditProfile() {
  const [profileData, setProfileData] = useState({
    name: "",
    username: "",
    about: "",
  })

  const [profileImage, setProfileImage] = useState(
    "https://storage.googleapis.com/a1aa/image/JzOdK_s60KO0H2AtMTCyuPGb0g3-_fxeCbQdIXvqjwI.jpg",
  )
  const [isChanged, setIsChanged] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setIsChanged(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Profile data:", profileData)
    alert("Profile updated successfully!")
    setIsChanged(false)
  }

  const handleChangePicture = () => {
    // In a real app, this would open a file picker
    alert("This would open a file picker in a real application")
  }

  const handleDeletePicture = () => {
    if (confirm("Are you sure you want to delete your profile picture?")) {
      setProfileImage("/placeholder.svg?height=80&width=80")
      setIsChanged(true)
    }
  }

  return (
    <div className="profile-settings">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Settings Profile</h1>
      </div>
      <div className="profile-container">
        <h2 className="profile-section-title">Profile</h2>
        <div className="profile-picture-section">
          <div className="avatar-container large">
            <Image
              src={profileImage || "/placeholder.svg"}
              alt="Profile picture"
              width={80}
              height={80}
              className="avatar-image"
            />
          </div>
          <div className="profile-picture-actions">
            <button className="btn btn-primary" onClick={handleChangePicture}>
              Change picture
            </button>
            <button className="btn btn-danger" onClick={handleDeletePicture}>
              Delete picture
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Profile Name</label>
            <input type="text" name="name" className="form-input bg-black" placeholder="Name" value={profileData.name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input type="text" name="username" className="form-input disabled" placeholder="Username" value={profileData.username} disabled />
          </div>
          <div className="form-group">
            <label className="form-label">About Me</label>
            <textarea
              name="about"
              placeholder="About me"
              className="form-input bg-black"
              rows={4}
              value={profileData.about}
              onChange={handleChange}
            ></textarea>
          </div>
          <button type="submit" className={`btn btn-secondary`} >
            Save changes
          </button>
        </form>
      </div>
    </div>
  )
}


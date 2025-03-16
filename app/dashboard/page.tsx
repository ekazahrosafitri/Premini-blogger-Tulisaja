"use client"
import { useState } from "react"
import Sidebar from "@/components/dashboard/sidebar"
import DashboardContent from "@/components/dashboard/dashboard-content"
import EditProfile from "@/components/dashboard/edit-profile"
import MyArticles from "@/components/dashboard/my-articles"
import CreateArticle from "@/components/dashboard/create-article"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("dashboard")

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardContent />
      case "editProfile":
        return <EditProfile />
      case "myArticles":
        return <MyArticles />
      case "createArticle":
        return <CreateArticle />
      default:
        return <DashboardContent />
    }
  }

  return (
    <div className="dashboard-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="dashboard-content">{renderContent()}</div>
    </div>
  )
}


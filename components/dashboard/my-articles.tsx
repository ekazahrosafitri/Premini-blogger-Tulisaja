"use client"

import { useState } from "react"
import Image from "next/image"

export default function MyArticles() {
  const [articles] = useState([
    {
      id: 1,
      title: "What is wireframing?",
      excerpt: "Introduction to Wireframing and its principles. Learn from the best in the industry.",
      image: "https://storage.googleapis.com/a1aa/image/d5qAUZzUvq4nP_eIJKYb2utlJw4n5WevbDjg9rrAJ_I.jpg",
      author: {
        name: "Cameron Yang",
        avatar: "https://storage.googleapis.com/a1aa/image/hp-mvt49YEdTFBGk-J04cdnSsv2R0_x21VFd2nqCVNs.jpg",
      },
      date: "Sep 28, 2020",
    },
    {
      id: 2,
      title: "How to learn from your peers",
      excerpt: "The design industry is constantly evolving, but good design is timeless. Learn how to adapt.",
      image: "https://storage.googleapis.com/a1aa/image/d5qAUZzUvq4nP_eIJKYb2utlJw4n5WevbDjg9rrAJ_I.jpg",
      author: {
        name: "Nia Clay",
        avatar: "https://storage.googleapis.com/a1aa/image/1RVAEc7Lj2o94yY1lPs02XhUgYoqX7KlA_ck2klUcR0.jpg",
      },
      date: "Sep 28, 2020",
    },
    {
      id: 3,
      title: "Building your API stack",
      excerpt: "The rise of RESTful APIs has been met by a rise in tools for creating, testing, and managing them.",
      image: "https://storage.googleapis.com/a1aa/image/d5qAUZzUvq4nP_eIJKYb2utlJw4n5WevbDjg9rrAJ_I.jpg",
      author: {
        name: "Amanda Lowery",
        avatar: "https://storage.googleapis.com/a1aa/image/Sm17vOfO92qu9KLGh96KMOarymColrZvKFEpuwCPGBg.jpg",
      },
      date: "Sep 28, 2020",
    },
  ])

  const [userData] = useState({
    name: "Adriana",
    fullName: "Adriana O'Sullivan",
    avatar: "https://storage.googleapis.com/a1aa/image/uhfIVtzZ8-Dl-Vkymsdz0P3AlEfmycxmyMzQ6gnrNgc.jpg",
  })

  const handleArticleClick = (id: number) => {
    console.log(`Article ${id} clicked`)
    // In a real app, this would navigate to the article edit page
  }

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
              alt="User profile picture"
              width={40}
              height={40}
              className="avatar-image"
            />
          </div>
        </div>
      </div>

      <div className="articles-section">
        <h2 className="section-title">Recent posts</h2>
        <div className="articles-grid">
          {articles.map((article) => (
            <div key={article.id} className="article-card" onClick={() => handleArticleClick(article.id)}>
              <div className="article-image-container">
                <Image
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  width={300}
                  height={200}
                  className="article-image"
                />
              </div>
              <h3 className="article-title">{article.title}</h3>
              <p className="article-excerpt">{article.excerpt}</p>
              <div className="article-meta">
                <div className="avatar-container small">
                  <Image
                    src={article.author.avatar || "/placeholder.svg"}
                    alt={`Profile picture of ${article.author.name}`}
                    width={32}
                    height={32}
                    className="avatar-image"
                  />
                </div>
                <span className="article-author">{article.author.name}</span>
                <span className="article-date">{article.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="articles-section">
        <h2 className="section-title">Draft</h2>
        <div className="articles-grid">
          {articles.map((article) => (
            <div
              key={`draft-${article.id}`}
              className="article-card"
              onClick={() => handleArticleClick(article.id + 100)}
            >
              <div className="article-image-container">
                <Image
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  width={300}
                  height={200}
                  className="article-image"
                />
              </div>
              <h3 className="article-title">{article.title}</h3>
              <p className="article-excerpt">{article.excerpt}</p>
              <div className="article-meta">
                <div className="avatar-container small">
                  <Image
                    src={article.author.avatar || "/placeholder.svg"}
                    alt={`Profile picture of ${article.author.name}`}
                    width={32}
                    height={32}
                    className="avatar-image"
                  />
                </div>
                <span className="article-author">{article.author.name}</span>
                <span className="article-date">{article.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


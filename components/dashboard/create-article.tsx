"use client"
import { useState, useRef, useEffect } from "react"
import type React from "react"

export default function CreateArticle() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: null as File | null,
  })
  const [charCount, setCharCount] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Clean up the URL when component unmounts or when a new file is selected
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name === "title") {
      setCharCount(value.length)
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFormData((prev) => ({
        ...prev,
        image: file,
      }))

      // Create a preview URL for the image
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      setFormData((prev) => ({
        ...prev,
        image: file,
      }))

      // Create a preview URL for the image
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Article data:", formData)
    alert("Article submitted successfully!")

    // Reset form
    setFormData({
      title: "",
      content: "",
      image: null,
    })
    setCharCount(0)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className="create-article">
      <h3 className="create-article-title">Create an Offer</h3>

      <form onSubmit={handleSubmit}>
        <div
          className={`file-upload-area ${isDragging ? "dragging" : ""}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {!previewUrl ? (
            <>
              <i className="fas fa-plus upload-icon"></i>
              <button type="button" className="upload-btn" onClick={triggerFileInput}>
                Upload File (jpg, jpeg, png)
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden-file-input"
                accept=".jpg,.jpeg,.png"
                onChange={handleFileChange}
              />
              <p className="upload-text">or drag and drop files to upload</p>
              <p className="upload-size-text">Recommended size: 300x250px</p>
            </>
          ) : (
            <div className="file-preview">
              <div className="preview-image-container">
                <img src={previewUrl || "/placeholder.svg"} alt="Preview" className="preview-image" />
              </div>
              <div className="preview-actions">
                <p>Selected file: {formData.image?.name}</p>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, image: null }))
                    URL.revokeObjectURL(previewUrl)
                    setPreviewUrl(null)
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Judul</label>
          <input
            type="text"
            name="title"
            className="form-input"
            placeholder="Tambahkan judul"
            value={formData.title}
            onChange={handleChange}
            maxLength={110}
          />
          <p className="char-count">{charCount}/110</p>
        </div>

        <div className="form-group">
          <label className="form-label">Isi artikel anda</label>
          <textarea
            name="content"
            className="form-input"
            placeholder=""
            value={formData.content}
            onChange={handleChange}
            rows={6}
          ></textarea>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={!formData.title || !formData.content}>
            Submit Offer
          </button>
        </div>
      </form>
    </div>
  )
}


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
    console.log("Article data:", formData)
    alert("Article submitted successfully!")

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
    <div className="w-full px-3 sm:px-6 py-6 max-w-md mx-auto sm:max-w-lg md:max-w-2xl">
      <h3 className="text-lg sm:text-xl font-bold mb-6 text-gray-800 text-center sm:text-left">Create an Offer</h3>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* File Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {!previewUrl ? (
            <div className="space-y-3">
              <i className="fas fa-plus text-2xl text-gray-400"></i>
              <button
                type="button"
                className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm"
                onClick={triggerFileInput}
              >
                Upload File (jpg, jpeg, png)
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".jpg,.jpeg,.png"
                onChange={handleFileChange}
              />
              <p className="text-xs text-gray-500">or drag and drop files to upload</p>
              <p className="text-xs text-gray-400">Recommended size: 300x250px</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-center">
                <img 
                  src={previewUrl || "/placeholder.svg"} 
                  alt="Preview" 
                  className="max-h-48 w-auto rounded-md object-contain"
                />
              </div>
              <div className="flex flex-col items-center space-y-2">
                <p className="text-xs text-gray-600 truncate w-full text-center">
                  Selected: {formData.image?.name}
                </p>
                <button
                  type="button"
                  className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, image: null }))
                    URL.revokeObjectURL(previewUrl!)
                    setPreviewUrl(null)
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Title Input */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Judul</label>
          <input
            type="text"
            name="title"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            placeholder="Tambahkan judul"
            value={formData.title}
            onChange={handleChange}
            maxLength={110}
          />
          <p className="text-xs text-gray-500 text-right">{charCount}/110</p>
        </div>

        {/* Content Textarea */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Isi artikel anda</label>
          <textarea
            name="content"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            placeholder="Tulis isi artikel di sini..."
            value={formData.content}
            onChange={handleChange}
            rows={5}
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            disabled={!formData.title || !formData.content}
          >
            Submit Offer
          </button>
        </div>
      </form>
    </div>
  )
}

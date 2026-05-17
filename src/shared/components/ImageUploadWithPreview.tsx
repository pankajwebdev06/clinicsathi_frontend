'use client'
import React, { useState, useRef } from 'react'

// XHR-based upload with real progress events (fetch API doesn't support progress)
export function uploadWithProgress(
  url: string,
  formData: FormData,
  token: string,
  onProgress: (pct: number) => void
): Promise<any> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100))
      }
    })
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText))
        } catch {
          resolve({})
        }
      } else {
        reject(new Error(`Upload failed (${xhr.status})`))
      }
    })
    xhr.addEventListener('error', () => reject(new Error('Network error during upload')))
    xhr.open('POST', url)
    xhr.setRequestHeader('Authorization', `Bearer ${token}`)
    xhr.send(formData)
  })
}

interface ImageUploadWithPreviewProps {
  id: string
  accept?: string
  label?: string
  onUpload: (file: File, onProgress: (pct: number) => void) => Promise<void>
  onError?: (err: Error) => void
  disabled?: boolean
  children: React.ReactNode
}

export function ImageUploadWithPreview({
  id,
  accept = 'image/*',
  label = 'Image Preview',
  onUpload,
  onError,
  disabled,
  children,
}: ImageUploadWithPreviewProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isPdf, setIsPdf] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadDone, setUploadDone] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const openPicker = () => {
    if (!disabled) inputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile(file)
    setProgress(0)
    setUploadDone(false)
    setUploading(false)
    if (file.type === 'application/pdf') {
      setIsPdf(true)
      setPreviewUrl(null)
    } else {
      setIsPdf(false)
      setPreviewUrl(URL.createObjectURL(file))
    }
    e.target.value = ''
  }

  const handleRetake = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setIsPdf(false)
    setProgress(0)
    setUploadDone(false)
    setTimeout(() => inputRef.current?.click(), 50)
  }

  const handleGood = async () => {
    if (!selectedFile) return
    setUploading(true)
    setProgress(0)
    try {
      await onUpload(selectedFile, (pct) => setProgress(pct))
      setUploadDone(true)
      setProgress(100)
      setTimeout(() => {
        setSelectedFile(null)
        setPreviewUrl(null)
        setIsPdf(false)
        setUploading(false)
        setUploadDone(false)
      }, 1200)
    } catch (err) {
      setUploading(false)
      if (onError) onError(err as Error)
      else alert('Upload failed. Please try again.')
    }
  }

  const handleClose = () => {
    if (uploading) return
    setSelectedFile(null)
    setPreviewUrl(null)
    setIsPdf(false)
    setProgress(0)
    setUploadDone(false)
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        id={id}
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled}
      />
      <div onClick={openPicker} style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}>
        {children}
      </div>

      {/* Preview + Upload Modal */}
      {selectedFile && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(0,0,0,0.75)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '16px',
        }}>
          <div style={{
            background: 'white', borderRadius: 20, padding: 24,
            maxWidth: 440, width: '100%',
            boxShadow: '0 30px 70px rgba(0,0,0,0.4)',
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontWeight: 800, fontSize: 17, color: '#0f172a' }}>{label}</h3>
              {!uploading && (
                <button
                  onClick={handleClose}
                  style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#94a3b8', lineHeight: 1, padding: '0 4px' }}
                >
                  ×
                </button>
              )}
            </div>

            {/* Image / File Preview */}
            <div style={{
              borderRadius: 14, overflow: 'hidden', marginBottom: 16,
              background: '#f8fafc', border: '1px solid #e2e8f0',
              minHeight: 160, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {isPdf ? (
                <div style={{ textAlign: 'center', padding: '28px 16px' }}>
                  <div style={{ fontSize: 52, marginBottom: 8 }}>📄</div>
                  <p style={{ color: '#475569', fontWeight: 600, fontSize: 14, margin: 0, wordBreak: 'break-all' }}>{selectedFile.name}</p>
                  <p style={{ color: '#94a3b8', fontSize: 12, margin: '4px 0 0' }}>PDF Document</p>
                </div>
              ) : previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{ width: '100%', maxHeight: 270, objectFit: 'contain', display: 'block' }}
                />
              ) : null}
            </div>

            {/* Progress Bar — visible only while uploading */}
            {uploading && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: uploadDone ? '#10b981' : '#475569' }}>
                    {uploadDone ? '✓ Upload complete!' : 'Uploading...'}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: uploadDone ? '#10b981' : '#2563eb' }}>
                    {progress}%
                  </span>
                </div>
                <div style={{ background: '#e2e8f0', borderRadius: 999, overflow: 'hidden', height: 10 }}>
                  <div style={{
                    background: uploadDone ? '#10b981' : 'linear-gradient(90deg, #2563eb, #0ea5e9)',
                    height: '100%',
                    width: `${progress}%`,
                    borderRadius: 999,
                    transition: 'width 0.25s ease, background 0.4s ease',
                  }} />
                </div>
                {!uploadDone && progress < 100 && (
                  <div style={{ display: 'flex', gap: 4, marginTop: 8, justifyContent: 'center' }}>
                    {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((step) => (
                      <div
                        key={step}
                        style={{
                          width: 6, height: 6, borderRadius: '50%',
                          background: progress >= step ? '#2563eb' : '#e2e8f0',
                          transition: 'background 0.2s ease',
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            {!uploading && (
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={handleRetake}
                  style={{
                    flex: 1, padding: '13px 0',
                    border: '2px solid #e2e8f0', borderRadius: 14,
                    fontWeight: 700, fontSize: 14, color: '#475569',
                    background: 'white', cursor: 'pointer',
                  }}
                >
                  🔄 Retake
                </button>
                <button
                  onClick={handleGood}
                  style={{
                    flex: 1.6, padding: '13px 0',
                    background: 'linear-gradient(135deg, #2563eb, #0ea5e9)',
                    border: 'none', borderRadius: 14,
                    fontWeight: 700, fontSize: 14, color: 'white',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(37,99,235,0.35)',
                  }}
                >
                  ✓ Looks Good — Upload
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

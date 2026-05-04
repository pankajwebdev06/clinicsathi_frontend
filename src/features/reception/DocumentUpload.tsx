'use client'
import React, { useState } from 'react'
import { Card, Button } from '@/components/ui'
import { Camera, Upload, CheckCircle2, AlertCircle, FileImage } from 'lucide-react'
import { consultationApi } from '../consultation/api'

interface DocumentUploadProps {
  patientId: string
  onUploadSuccess?: () => void
}

export function DocumentUpload({ patientId, onUploadSuccess }: DocumentUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async (type: 'prescription' | 'report', file: File) => {
    setUploading(true)
    setError(null)
    setSuccess(false)

    try {
      const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
      
      // Create a consultation record to attach the image to
      const consult = await consultationApi.createConsultation({
        clinic_id: userInfo.clinic_id,
        patient_id: patientId,
        doctor_id: userInfo.id || 'reception_upload',
        doctor_notes: type === 'prescription' ? "Handwritten Prescription Uploaded" : "Report Uploaded"
      });

      const formData = new FormData()
      formData.append('file', file)

      const endpoint = type === 'prescription' 
        ? `/api/v1/consultations/${consult.id}/upload-prescription`
        : `/api/v1/consultations/${consult.id}/upload-report`

      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + endpoint.replace('/api/v1', ''), {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Upload failed')

      setSuccess(true)
      if (onUploadSuccess) onUploadSuccess()
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'prescription' | 'report') => {
    const file = e.target.files?.[0]
    if (file) {
      handleUpload(type, file)
    }
  }

  return (
    <div className="space-y-4 max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Upload Visit Documents</h2>

      {/* Prescription Upload Card */}
      <Card className="p-6 border-dashed border-2 border-teal-100 bg-teal-50/30">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="bg-teal-100 p-3 rounded-full text-teal-600">
            <Camera size={24} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Handwritten Prescription</h3>
            <p className="text-xs text-gray-500 mt-1">Upload the paper signed by the doctor</p>
          </div>
          <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            id="prescription-input"
            className="hidden" 
            onChange={(e) => onFileChange(e, 'prescription')}
            disabled={uploading}
          />
          <label htmlFor="prescription-input">
            <Button variant="default" className="bg-teal-600 hover:bg-teal-700 pointer-events-none" disabled={uploading}>
              {uploading ? 'Processing...' : 'Capture & Upload'}
            </Button>
          </label>
        </div>
      </Card>

      {/* Other Reports Upload Card */}
      <Card className="p-6 border-dashed border-2 border-blue-100 bg-blue-50/30">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="bg-blue-100 p-3 rounded-full text-blue-600">
            <FileImage size={24} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Lab Reports / Others</h3>
            <p className="text-xs text-gray-500 mt-1">Upload Blood test, Ultrasound, etc.</p>
          </div>
          <input 
            type="file" 
            accept="image/*" 
            multiple
            id="reports-input"
            className="hidden" 
            onChange={(e) => onFileChange(e, 'report')}
            disabled={uploading}
          />
          <label htmlFor="reports-input">
            <Button variant="secondary" className="bg-blue-600 text-white hover:bg-blue-700 pointer-events-none" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Select Files'}
            </Button>
          </label>
        </div>
      </Card>

      {/* Status Messages */}
      {success && (
        <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
          <CheckCircle2 size={16} /> Documents uploaded successfully!
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm font-medium">
          <AlertCircle size={16} /> {error}
        </div>
      )}
    </div>
  )
}

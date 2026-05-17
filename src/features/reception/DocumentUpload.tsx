'use client'
import React, { useState } from 'react'

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/api\/v1\/?$/, '');
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

  const [reportType, setReportType] = useState('')

  const handleUpload = async (type: 'prescription' | 'report', file: File) => {
    if (type === 'report' && !reportType.trim()) {
      setError('Please enter the report type before uploading.');
      return;
    }
    setUploading(true)
    setError(null)
    setSuccess(false)

    try {
      const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
      
      const consult = await consultationApi.createConsultation({
        clinic_id: userInfo.clinic_id,
        patient_id: patientId,
        doctor_id: userInfo.id || 'reception_upload',
        doctor_notes: type === 'prescription' ? "Handwritten Prescription Uploaded" : `Report Uploaded: ${reportType}`
      });

      const formData = new FormData()
      formData.append('file', file)

      const endpoint = type === 'prescription' 
        ? `/api/v1/consultations/${consult.id}/upload-prescription`
        : `/api/v1/consultations/${consult.id}/upload-report`

      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        body: formData,
        headers: { Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}` },
      })

      if (!response.ok) throw new Error('Upload failed')

      setSuccess(true)
      setReportType('')
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
    // reset input
    e.target.value = '';
  }

  return (
    <div className="space-y-3 w-full">
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
        {/* Prescription Upload */}
        <div className="flex-1 relative w-full">
          <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            id={`prescription-input-${patientId}`}
            className="hidden" 
            onChange={(e) => onFileChange(e, 'prescription')}
            disabled={uploading}
          />
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2 border-teal-200 text-teal-700 hover:bg-teal-50"
            onClick={() => document.getElementById(`prescription-input-${patientId}`)?.click()}
            disabled={uploading}
          >
            <Camera size={16} /> 
            Upload Prescription
          </Button>
        </div>

        {/* Other Report Upload */}
        <div className="flex-[1.5] w-full flex flex-col gap-2">
          <input
            type="text"
            placeholder="Report type (e.g. Blood Test, X-Ray)"
            value={reportType}
            onChange={e => setReportType(e.target.value)}
            className="w-full border border-blue-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            disabled={uploading}
          />
          <input
            type="file"
            accept="image/*,application/pdf"
            id={`reports-input-${patientId}`}
            className="hidden"
            onChange={(e) => onFileChange(e, 'report')}
            disabled={uploading}
          />
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 border-blue-200 text-blue-700 hover:bg-blue-50"
            onClick={() => {
              if (!reportType.trim()) {
                setError('Please type report name first');
                return;
              }
              document.getElementById(`reports-input-${patientId}`)?.click()
            }}
            disabled={uploading}
          >
            <Upload size={16} />
            Upload Report
          </Button>
        </div>
      </div>

      {/* Status Messages */}
      {success && (
        <div className="flex items-center gap-2 p-2 bg-green-50 text-green-700 rounded text-xs font-medium">
          <CheckCircle2 size={14} /> Uploaded successfully!
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 p-2 bg-red-50 text-red-700 rounded text-xs font-medium">
          <AlertCircle size={14} /> {error}
        </div>
      )}
    </div>
  )
}

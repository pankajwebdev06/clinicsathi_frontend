'use client'
import React, { useState } from 'react'

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/api\/v1\/?$/, '');
import { Button } from '@/components/ui'
import { Camera, Upload, CheckCircle2, AlertCircle } from 'lucide-react'
import { consultationApi } from '../consultation/api'
import { ImageUploadWithPreview, uploadWithProgress } from '@/shared/components/ImageUploadWithPreview'

interface DocumentUploadProps {
  patientId: string
  onUploadSuccess?: () => void
}

export function DocumentUpload({ patientId, onUploadSuccess }: DocumentUploadProps) {
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reportType, setReportType] = useState('')

  const buildUploader = (type: 'prescription' | 'report') => async (file: File, onProgress: (pct: number) => void) => {
    if (type === 'report' && !reportType.trim()) {
      throw new Error('Please enter the report type before uploading.')
    }
    setError(null)
    setSuccess(false)

    const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}')

    const consult = await consultationApi.createConsultation({
      clinic_id: userInfo.clinic_id,
      patient_id: patientId,
      doctor_id: userInfo.id || 'reception_upload',
      doctor_notes: type === 'prescription' ? 'Handwritten Prescription Uploaded' : `Report Uploaded: ${reportType}`,
    })

    const formData = new FormData()
    formData.append('file', file)

    const endpoint = type === 'prescription'
      ? `/api/v1/consultations/${consult.id}/upload-prescription`
      : `/api/v1/consultations/${consult.id}/upload-report`

    await uploadWithProgress(
      `${API_BASE}${endpoint}`,
      formData,
      localStorage.getItem('auth_token') || '',
      onProgress
    )

    setSuccess(true)
    if (type === 'report') setReportType('')
    if (onUploadSuccess) onUploadSuccess()
  }

  return (
    <div className="space-y-3 w-full">
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
        {/* Prescription Upload */}
        <div className="flex-1 relative w-full">
          <ImageUploadWithPreview
            id={`prescription-input-${patientId}`}
            accept="image/*"
            label="Prescription Preview"
            onUpload={buildUploader('prescription')}
            onError={(err) => setError(err.message || 'Something went wrong. Please try again.')}
          >
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 border-teal-200 text-teal-700 hover:bg-teal-50 pointer-events-none"
            >
              <Camera size={16} />
              Upload Prescription
            </Button>
          </ImageUploadWithPreview>
        </div>

        {/* Other Report Upload */}
        <div className="flex-[1.5] w-full flex flex-col gap-2">
          <input
            type="text"
            placeholder="Report type (e.g. Blood Test, X-Ray)"
            value={reportType}
            onChange={e => setReportType(e.target.value)}
            className="w-full border border-blue-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <ImageUploadWithPreview
            id={`reports-input-${patientId}`}
            accept="image/*,application/pdf"
            label="Report Preview"
            onUpload={buildUploader('report')}
            onError={(err) => setError(err.message || 'Something went wrong. Please try again.')}
          >
            <div
              onClick={(e) => {
                if (!reportType.trim()) {
                  e.stopPropagation()
                  setError('Please type report name first')
                }
              }}
            >
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 border-blue-200 text-blue-700 hover:bg-blue-50 pointer-events-none"
              >
                <Upload size={16} />
                Upload Report
              </Button>
            </div>
          </ImageUploadWithPreview>
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

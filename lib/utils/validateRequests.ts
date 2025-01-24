// lib/utils/validateRequest.ts
import { ApiError } from '@/lib/errors'

export const validateRequest = async (req: Request) => {
  // Validate HTTP method
  if (req.method !== 'POST') {
    throw new ApiError(405, 'Method not allowed')
  }

  // Validate content type
  const contentType = req.headers.get('content-type')
  if (!contentType?.startsWith('multipart/form-data')) {
    throw new ApiError(400, 'Invalid content type')
  }

  // Validate file existence
  const formData = await req.formData()
  const file = formData.get('file')
  
  if (!file || !(file instanceof File)) {
    throw new ApiError(400, 'No PDF file uploaded')
  }

  // Validate file type and size
  if (file.type !== 'application/pdf') {
    throw new ApiError(400, 'Invalid file type')
  }

  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
  if (file.size > MAX_FILE_SIZE) {
    throw new ApiError(413, 'File size exceeds 5MB limit')
  }
}
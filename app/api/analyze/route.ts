import { NextResponse } from 'next/server'
import { handleApiError } from '@/lib/errors'
import { rateLimiter } from '@/lib/middlewares/rateLimiter'
import { NextRequest } from 'next/server'


export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    await rateLimiter(request)

    const { text } = await request.json()
    
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Invalid input: text is required' },
        { status: 400 }
      )
    }

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{
          role: "user",
          content: `Please summarize this document in clear, concise bullet points. Focus on key findings, main arguments, and critical data. Document content: ${text}`
        }],
        temperature: 0.7
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to analyze document')
    }

    const data = await response.json()
    return NextResponse.json({ summary: data.choices[0].message.content })

  } catch (error) {
    return handleApiError(error)
  }
}
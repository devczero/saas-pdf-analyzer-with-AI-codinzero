import { NextRequest } from 'next/server'
import { LRUCache } from 'lru-cache'
import { ApiError } from '../errors'

const rateLimitCache = new LRUCache<string, number>({
  max: 1000,
  ttl: 60 * 1000 // 1 minute
})

export const rateLimiter = async (req: NextRequest) => {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1'
  const limit = 5 // Requests per minute
  const currentCount = (rateLimitCache.get(ip) || 0) as number

  if (currentCount >= limit) {
    throw new ApiError(429, 'Too many requests')
  }

  rateLimitCache.set(ip, currentCount + 1)
}
'use client'

import { useState, useEffect, useCallback } from 'react'
import Navbar from '../../components/Navbar'
import { extractTextFromPDF } from '../../lib/pdfUtils'
import {StripeButton} from './stripe-button';
import { UserResponse } from '@/types/user';

export default function Dashboard() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [summary, setSummary] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [userData, setUserData] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const isSubscribed = userData?.subscription?.status === 'active';

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user');
        
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const data: UserResponse = await response.json();
        setUserData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('')
    if (!e.target.files?.[0]) return
    setSelectedFile(e.target.files[0])
  }

  const handleAnalyze = useCallback(async () => {
    if (!selectedFile) {
      setError('Please select a file before analyzing.')
      return
    }

    setIsLoading(true)
    setError('')
    setSummary('')

    try {
      const text = await extractTextFromPDF(selectedFile)

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ text: text.substring(0, 10000) }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setSummary(data.summary || 'No summary was generated.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze PDF.')
    } finally {
      setIsLoading(false)
    }
  }, [selectedFile])

  const formatSummaryContent = (text: string) => {
    return text.split('\n').map((paragraph, index) => (
      <p key={index} className="mb-4 text-gray-300 leading-relaxed">
        {paragraph.replace(/^\s*[\-•*]\s*/, '• ')}
      </p>
    ))
  }

  if (!isSubscribed) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center space-y-8 p-4">
        <div className="bg-[#1A1A23] p-10 rounded-2xl shadow-2xl border border-[#2A2A35] max-w-md w-full">
          <p className="text-2xl font-bold text-white mb-6 text-center">Premium Access Required</p>
          <StripeButton />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-gray-200">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          <>
            <div className="bg-[#1A1A23] p-10 rounded-2xl shadow-2xl border border-[#2A2A35]">
              <h1 className="text-3xl font-bold text-white mb-8 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                AI Document Analysis
              </h1>
              <div className="space-y-6">
                <div className="relative group">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf"
                    className="block w-full text-gray-400 file:mr-4 file:py-3 file:px-6 
                             file:rounded-xl file:border-0 file:text-sm file:font-medium
                             file:bg-gradient-to-r file:from-purple-500 file:to-pink-500 
                             file:text-white hover:file:opacity-90 transition-all
                             focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                  />
                </div>
                <button
                  onClick={handleAnalyze}
                  disabled={!selectedFile || isLoading}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium
                           py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-[1.02]
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                           shadow-lg hover:shadow-purple-500/25"
                >
                  {isLoading ? 'Processing...' : 'Analyze Document'}
                </button>
              </div>
            </div>

            {isLoading && (
              <div className="text-center">
                <div className="inline-flex items-center px-6 py-3 rounded-xl bg-[#1A1A23] border border-purple-500/30">
                  <div className="animate-spin mr-3 h-4 w-4 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                  <span className="text-purple-400">Analyzing your document...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400">
                {error}
              </div>
            )}

            {summary && (
              <div className="bg-[#1A1A23] rounded-2xl p-8 shadow-2xl border border-[#2A2A35] animate-fade-in">
                <div className="flex items-center mb-8">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                    Document Insights
                  </h2>
                </div>
                
                <div className="prose prose-invert max-w-none">
                  {formatSummaryContent(summary)}
                </div>
                
                <div className="mt-8 pt-6 border-t border-[#2A2A35] flex items-center justify-between text-sm text-gray-400">
                  <span>Generated at {new Date().toLocaleTimeString()}</span>
                  <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs">
                    AI Summary
                  </span>
                </div>
              </div>
            )}
          </>
        </div>
      </main>
    </div>
  )
}
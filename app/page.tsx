import Navbar from '../components/Navbar'
import Link from 'next/link'

const Home = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center space-y-12">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              AI-Powered PDF Summarization
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              A modern AI-powered PDF summarizer that saves your time by extracting key insights from your PDFs.
            </p>
          </div>

          <div className="flex justify-center space-x-6">
            <Link 
              href="/dashboard"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium
                       px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02]
                       hover:shadow-lg hover:shadow-purple-500/25"
            >
              Get Started
            </Link>
            <Link
              href="/sign-in"
              className="text-gray-300 hover:text-white px-8 py-4 rounded-xl 
                       hover:bg-[#1A1A23] transition-all duration-200"
            >
              Learn More
            </Link>
          </div>

          <div className="pt-12">
            <div className="p-6 rounded-2xl bg-[#1A1A23] border border-[#2A2A35] max-w-3xl mx-auto">
              <div className="flex items-center justify-center space-x-4 text-gray-400">
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Fast Analysis
                </span>
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Key Insights
                </span>
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  AI-Powered
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home
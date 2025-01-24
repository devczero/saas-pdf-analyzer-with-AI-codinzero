'use client'

import Link from 'next/link'
import { UserButton, SignedIn, SignedOut, useUser } from '@clerk/nextjs'

const Navbar = () => {
  const { isLoaded } = useUser()

  return (
    <nav className="bg-[#0A0A0F] backdrop-blur-lg border-b border-[#2A2A35]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent hover:opacity-90 transition-opacity">
            PDFtoolAI
          </Link>
          
          <div className="flex items-center space-x-6">
            <SignedIn>
              <Link 
                href="/dashboard" 
                className="text-gray-300 hover:text-white px-4 py-2 rounded-lg hover:bg-[#1A1A23] transition-all duration-200"
              >
                Dashboard
              </Link>
              <div className="ml-2">
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10 ring-2 ring-purple-500/20 rounded-full hover:ring-purple-500/40 transition-all",
                      userButtonPopoverCard: "bg-[#1A1A23] border border-[#2A2A35] shadow-xl",
                    }
                  }}
                />
              </div>
            </SignedIn>

            <SignedOut>
              <div className="flex items-center space-x-4">
                <Link
                  href="/sign-in"
                  className="text-gray-300 hover:text-white px-4 py-2 rounded-lg hover:bg-[#1A1A23] transition-all duration-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2.5 rounded-xl font-medium
                           hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  Get Started
                </Link>
              </div>
            </SignedOut>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
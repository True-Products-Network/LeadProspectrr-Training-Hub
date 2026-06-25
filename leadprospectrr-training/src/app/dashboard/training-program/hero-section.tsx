"use client"

import { Badge } from '@/components/ui/badge'
import { BookOpen, FileText, Zap } from 'lucide-react'
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'

interface HeroSectionProps {
  totalModules: number
  totalResources: number
}

export function HeroSection({ totalModules, totalResources }: HeroSectionProps) {
  return (
    <div className="bg-gradient-to-br from-blue-600 via-violet-600 to-purple-600 rounded-3xl p-8 text-white">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
        <div className="max-w-3xl">
          <Badge className="bg-white/20 text-white mb-4">
            Weekly LeadProspectrr Clinics
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to LeadProspectrr Clinics
          </h1>
          <p className="text-xl text-white/90 mb-6">
            Simple, practical training to help you use LeadProspectrr with confidence. 
            Learn the tools, take action, and grow your business.
          </p>
          
          {/* Program Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
              <BookOpen className="w-6 h-6 mx-auto mb-2" />
              <p className="text-2xl font-bold">{totalModules}</p>
              <p className="text-sm text-white/80">Modules</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
              <FileText className="w-6 h-6 mx-auto mb-2" />
              <p className="text-2xl font-bold">{totalResources || 0}</p>
              <p className="text-sm text-white/80">Resources</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
              <Zap className="w-6 h-6 mx-auto mb-2" />
              <p className="text-2xl font-bold">Growing</p>
              <p className="text-sm text-white/80">Content</p>
            </div>
          </div>
        </div>

        {/* Hero Image with Modal */}
        <div className="flex-shrink-0 lg:pl-4">
          <Dialog>
            <DialogTrigger
              render={
                <button className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-2xl transition-transform duration-300 hover:scale-105 hover:shadow-3xl">
                  <Image
                    src="/training-hero-image.jpg"
                    alt="Training Program"
                    width={400}
                    height={300}
                    className="object-cover rounded-2xl"
                    priority
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  <div className="absolute bottom-3 right-3 bg-white/90 text-slate-700 text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Click to enlarge
                  </div>
                </button>
              }
            />
            <DialogContent className="max-w-4xl p-0 bg-transparent border-0 shadow-none">
              <div className="relative">
                <Image
                  src="/training-hero-image.jpg"
                  alt="Training Program"
                  width={1200}
                  height={900}
                  className="object-contain rounded-lg max-h-[85vh] w-auto"
                  priority
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}

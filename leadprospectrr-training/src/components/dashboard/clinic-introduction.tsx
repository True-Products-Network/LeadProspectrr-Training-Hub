'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Target, 
  Zap, 
  BookOpen, 
  TrendingUp, 
  Award,
  ArrowRight,
  FileText,
  LayoutTemplate,
  HelpCircle
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export function ClinicIntroduction() {
  const [isDismissed, setIsDismissed] = useState(false)

  if (isDismissed) return null

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card className="bg-gradient-to-br from-blue-600 via-violet-600 to-purple-600 text-white border-0 overflow-hidden">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Welcome to LeadProspectrr Training Hub
              </h1>
              <p className="text-lg text-white/90 max-w-2xl">
                Simple, practical training to help you use LeadProspectrr with confidence. 
                Learn the tools, take action, and grow your business.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Target className="w-12 h-12" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* The 4 Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">1. Understand the Basics</h3>
                <p className="text-sm text-slate-600">
                  Learn what the tools do and when to use them
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-violet-500">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                <Zap className="w-6 h-6 text-violet-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">2. Take Action Faster</h3>
                <p className="text-sm text-slate-600">
                  Work smarter with simple steps you can use right away
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                <LayoutTemplate className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">3. Use Ready-Made Tools</h3>
                <p className="text-sm text-slate-600">
                  Templates, cheat sheets, and guides to save time
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">4. Grow with Confidence</h3>
                <p className="text-sm text-slate-600">
                  Build better systems, follow-up, and results
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resources Available */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            What You Will Find in Each Clinic
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
              <LayoutTemplate className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900">Templates</h4>
              <p className="text-sm text-slate-600">
                Ready-to-use templates you can customize for your business
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900">Cheat Sheets</h4>
              <p className="text-sm text-slate-600">
                Quick reference guides for fast access to key information
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900">Guides</h4>
              <p className="text-sm text-slate-600">
                Step-by-step instructions to help you learn and apply
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="bg-slate-50 border-dashed">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  Each clinic helps you learn, apply, and move forward
                </h3>
                <p className="text-slate-600">
                  One step at a time. Track your progress, earn points, and build your skills.
                </p>
              </div>
            </div>
            <Link href="#modules">
              <Button className="bg-gradient-to-r from-blue-500 to-violet-600 whitespace-nowrap">
                Start Your First Clinic
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Dismiss Button */}
      <div className="flex justify-end">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsDismissed(true)}
          className="text-slate-400 hover:text-slate-600"
        >
          <HelpCircle className="w-4 h-4 mr-2" />
          Hide this introduction
        </Button>
      </div>
    </div>
  )
}

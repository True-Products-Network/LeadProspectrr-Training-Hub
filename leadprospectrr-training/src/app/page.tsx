import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BookOpen, Shield, Zap, Users, ChevronRight, CheckCircle2, Layers, Calendar } from 'lucide-react'

export default function HomePage() {
  const features = [
    {
      icon: BookOpen,
      title: 'Comprehensive Training',
      description: 'Weekly training modules covering everything from blog posts to advanced automation.',
    },
    {
      icon: Shield,
      title: 'Secure Access',
      description: 'Your training materials are protected with enterprise-grade security.',
    },
    {
      icon: Zap,
      title: 'Always Growing',
      description: 'New content added every week as the clinic builds up over time.',
    },
    {
      icon: Users,
      title: 'Expert Support',
      description: 'Get help when you need it with our dedicated support team.',
    },
  ]

  const weeks = [
    { title: 'Creating Blog Posts', icon: BookOpen },
    { title: 'Contacts and Smart Lists', icon: Users },
    { title: 'Email Templates & Campaigns', icon: Zap },
    { title: 'Understanding Conversations Inbox', icon: BookOpen },
    { title: 'Opportunities & Pipelines', icon: Layers },
    { title: 'Calendars and Appointment Bookings', icon: Calendar },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span className="font-bold text-xl">LeadProspectrr Training Hub</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-violet-600/5" />
        <div className="container mx-auto px-4 py-24 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-8">
              <Zap className="w-4 h-4" />
              Weekly Training Clinic
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
              Master Lead Generation with{' '}
              <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                LeadProspectrr Training Hub
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
              Join our weekly training clinic that builds up over time. Access guides, templates, 
              and resources all in one secure location. New content added every week!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="h-14 px-8 text-lg">
                  Start Your Journey
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our training library grows with you. New modules added weekly to keep you ahead.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Training Program */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Weekly Training Clinic
              </h2>
              <p className="text-lg text-slate-600">
                A growing collection of training modules that expands every week
              </p>
            </div>
            <div className="space-y-4">
              {weeks.map((week, index) => (
                <div
                  key={index}
                  className="flex items-center gap-6 p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shrink-0">
                    <span className="text-white font-bold text-2xl">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900">{week.title}</h3>
                    <p className="text-slate-600">Week {index + 1} of your training journey</p>
                  </div>
                  <CheckCircle2 className="w-6 h-6 text-slate-300" />
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <p className="text-slate-500">And more modules added every week...</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-violet-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Lead Generation?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join the weekly training clinic and grow your skills week by week.
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="h-14 px-8 text-lg">
              Get Started Free
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-slate-400">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="font-bold text-white">LeadProspectrr Training Hub</span>
            </div>
            <div className="flex items-center gap-6">
              <a 
                href="https://hub.leadprospectrr.com/terms" 
                className="text-sm hover:text-white transition-colors"
              >
                Terms of Service
              </a>
              <a 
                href="https://hub.leadprospectrr.com/privacy" 
                className="text-sm hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
            </div>
            <p className="text-sm">
              © {new Date().getFullYear()} LeadProspectrr Training Hub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

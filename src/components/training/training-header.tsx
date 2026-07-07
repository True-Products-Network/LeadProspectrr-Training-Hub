import { BookOpen, GraduationCap, Clock, Layers } from 'lucide-react'

interface TrainingHeaderProps {
  totalModules?: number
  totalResources?: number
}

export function TrainingHeader({ totalModules = 6, totalResources = 0 }: TrainingHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-3xl p-8 text-white">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="w-6 h-6" />
            <span className="text-violet-100 font-medium">Weekly Training Clinic</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            LeadProspectrr Training Hub
          </h1>
          <p className="text-violet-100 text-lg max-w-2xl">
            Master the art of lead generation with our comprehensive weekly training program. 
            New content added regularly as the clinic builds up over time.
          </p>
        </div>
        <div className="hidden md:block">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <Layers className="w-8 h-8 mb-2" />
            <p className="text-2xl font-bold">{totalModules}</p>
            <p className="text-violet-100">Modules</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/20">
        <div className="text-center">
          <p className="text-3xl font-bold">{totalModules}</p>
          <p className="text-violet-100 text-sm">Training Modules</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold">{totalResources}</p>
          <p className="text-violet-100 text-sm">Resources</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold">∞</p>
          <p className="text-violet-100 text-sm">Growing Content</p>
        </div>
      </div>
    </div>
  )
}

import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Award, BookOpen, CheckCircle2, Target } from 'lucide-react'

interface ProgressOverviewProps {
  overallProgress: number
  completedModules: number
  totalModules: number
  totalResources: number
}

export function ProgressOverview({ overallProgress, completedModules, totalModules, totalResources }: ProgressOverviewProps) {
  const stats = [
    {
      title: 'Overall Progress',
      value: `${overallProgress}%`,
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Modules Completed',
      value: `${completedModules}/${totalModules}`,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Current Streak',
      value: '3 days',
      icon: Award,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      title: 'Resources',
      value: totalResources.toString(),
      icon: BookOpen,
      color: 'text-violet-600',
      bgColor: 'bg-violet-50',
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Your Progress</h2>
        <span className="text-sm text-slate-500">Keep up the great work!</span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Training Completion</span>
            <span className="text-sm font-bold text-slate-900">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-3" />
          <p className="text-sm text-slate-500 mt-2">
            {completedModules === totalModules 
              ? 'Congratulations! You\'ve completed all training modules.' 
              : `Complete ${totalModules - completedModules} more module${totalModules - completedModules !== 1 ? 's' : ''} to finish the program.`}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

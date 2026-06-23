interface WelcomeHeaderProps {
  user: {
    name?: string
    email?: string
  }
}

export function WelcomeHeader({ user }: WelcomeHeaderProps) {
  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-violet-600 rounded-3xl p-8 text-white">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">
        {greeting()}, {user.name?.split(' ')[0] || 'there'}!
      </h1>
      <p className="text-blue-100 text-lg">
        Welcome to your LeadProspectrr Training Hub. Continue your journey to mastering lead generation.
      </p>
    </div>
  )
}

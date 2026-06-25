interface WelcomeHeaderProps {
  user: {
    name?: string
    email?: string
  }
  timezone?: string
}

export function WelcomeHeader({ user, timezone = 'America/Chicago' }: WelcomeHeaderProps) {
  const greeting = () => {
    // Get current time in user's timezone
    const now = new Date()
    const options: Intl.DateTimeFormatOptions = {
      timeZone: timezone,
      hour: 'numeric',
      hour12: false
    }
    const hourStr = new Intl.DateTimeFormat('en-US', options).format(now)
    const hour = parseInt(hourStr, 10)
    
    if (hour < 12) return 'Good Morning'
    if (hour < 18) return 'Good Afternoon'
    return 'Good Evening'
  }

  const firstName = user.name?.split(' ')[0] || 'there'

  return (
    <div className="bg-gradient-to-r from-blue-600 to-violet-600 rounded-3xl p-8 text-white">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">
        Welcome to LeadProspectrr Training Hub. {greeting()}, {firstName}!
      </h1>
      <p className="text-blue-100 text-lg">
        The LeadProspectrr Training Hub gives you simple weekly lessons to help you manage leads, contacts, follow-up, and client opportunities. New modules are added regularly, so you can keep learning and improving as the program grows.
      </p>
    </div>
  )
}

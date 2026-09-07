export default function Calendar() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <a href="/" style={{ color: '#2563eb', textDecoration: 'none' }}>← Back to Dashboard</a>
      
      <h1 style={{ marginTop: '20px' }}>Calendar Integration</h1>
      <p style={{ color: '#666' }}>Auto-add your daily activities to your calendar</p>

      <div style={{ marginTop: '30px', padding: '20px', background: '#dbeafe', borderRadius: '8px' }}>
        <h2 style={{ marginTop: 0 }}>Why Integrate?</h2>
        <p>If it's not on your calendar, it doesn't exist. By blocking time for your daily non-negotiables, you:</p>
        <ul style={{ lineHeight: '1.8' }}>
          <li>Protect that time from other meetings</li>
          <li>Get reminders so you don't forget</li>
          <li>Build the habit through consistency</li>
          <li>Track your actual vs. planned activity</li>
        </ul>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h2>Daily Calendar Blocks</h2>
        <p style={{ color: '#666', fontSize: '14px' }}>Add these recurring events to your calendar</p>
        
        <div style={{ marginTop: '20px' }}>
          <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: '0 0 5px 0', color: '#2563eb' }}>📧 Send Email to List</h3>
                <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>30 minutes • Mon-Fri • 8:00-8:30am</p>
              </div>
              <a 
                href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Send+Email+to+List&details=Send+1+email+to+your+10K+list.+Use+template+from+dashboard.&dates=20250617T080000/20250617T083000&recur=RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR"
                target="_blank"
                rel="noopener noreferrer"
                style={{ 
                  background: '#2563eb', 
                  color: 'white', 
                  padding: '10px 15px', 
                  textDecoration: 'none', 
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                Add to Google Calendar
              </a>
            </div>
          </div>

          <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: '0 0 5px 0', color: '#9333ea' }}>📞 Outreach Calls</h3>
                <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>60 minutes • Mon-Fri • 8:30-9:30am</p>
              </div>
              <a 
                href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Outreach+Calls&details=Make+5+cold+calls.+Use+scripts+from+dashboard.&dates=20250617T083000/20250617T093000&recur=RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR"
                target="_blank"
                rel="noopener noreferrer"
                style={{ 
                  background: '#9333ea', 
                  color: 'white', 
                  padding: '10px 15px', 
                  textDecoration: 'none', 
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                Add to Google Calendar
              </a>
            </div>
          </div>

          <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: '0 0 5px 0', color: '#ea580c' }}>🔄 Follow-Up</h3>
                <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>30 minutes • Mon-Fri • 9:30-10:00am</p>
              </div>
              <a 
                href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Follow-Up&details=Follow+up+on+yesterday's+calls+and+open+proposals.&dates=20250617T093000/20250617T100000&recur=RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR"
                target="_blank"
                rel="noopener noreferrer"
                style={{ 
                  background: '#ea580c', 
                  color: 'white', 
                  padding: '10px 15px', 
                  textDecoration: 'none', 
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                Add to Google Calendar
              </a>
            </div>
          </div>

          <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: '0 0 5px 0', color: '#16a34a' }}>✍️ Create Content</h3>
                <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>60 minutes • Mon-Fri • 10:00-11:00am</p>
              </div>
              <a 
                href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Create+Content&details=Write+1+piece+of+content+(LinkedIn+post,+email+snippet,+or+video).&dates=20250617T100000/20250617T110000&recur=RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR"
                target="_blank"
                rel="noopener noreferrer"
                style={{ 
                  background: '#16a34a', 
                  color: 'white', 
                  padding: '10px 15px', 
                  textDecoration: 'none', 
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                Add to Google Calendar
              </a>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h2>Weekly Structure Blocks</h2>
        <p style={{ color: '#666', fontSize: '14px' }}>Add these for specific days</p>
        
        <div style={{ marginTop: '20px' }}>
          <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: '0 0 5px 0', color: '#dc2626' }}>📅 Monday: Planning & Outreach Blitz</h3>
                <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Plan week's content, send weekly email, 10 calls minimum</p>
              </div>
              <a 
                href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Monday:+Planning+%26+Outreach+Blitz&details=Plan+week's+content,+send+weekly+email,+10+calls+minimum,+review+last+week's+follow-ups&dates=20250616T080000/20250616T110000&recur=RRULE:FREQ=WEEKLY;BYDAY=MO"
                target="_blank"
                rel="noopener noreferrer"
                style={{ 
                  background: '#dc2626', 
                  color: 'white', 
                  padding: '10px 15px', 
                  textDecoration: 'none', 
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                Add to Calendar
              </a>
            </div>
          </div>

          <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: '0 0 5px 0', color: '#0891b2' }}>📅 Wednesday: Content & Authority</h3>
                <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Write long-form piece, record video, schedule social posts</p>
              </div>
              <a 
                href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Wednesday:+Content+%26+Authority&details=Write+1+long-form+piece,+record+1+video,+schedule+social+posts&dates=20250618T080000/20250618T110000&recur=RRULE:FREQ=WEEKLY;BYDAY=WE"
                target="_blank"
                rel="noopener noreferrer"
                style={{ 
                  background: '#0891b2', 
                  color: 'white', 
                  padding: '10px 15px', 
                  textDecoration: 'none', 
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                Add to Calendar
              </a>
            </div>
          </div>

          <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: '0 0 5px 0', color: '#ea580c' }}>📅 Friday: Follow-Up & Close</h3>
                <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Follow up on ALL open proposals, close deals, plan next week</p>
              </div>
              <a 
                href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Friday:+Follow-Up+%26+Close&details=Follow+up+on+ALL+open+proposals,+close+deals+or+get+clear+no,+plan+next+week's+outreach,+send+weekend+value+email&dates=20250620T080000/20250620T110000&recur=RRULE:FREQ=WEEKLY;BYDAY=FR"
                target="_blank"
                rel="noopener noreferrer"
                style={{ 
                  background: '#ea580c', 
                  color: 'white', 
                  padding: '10px 15px', 
                  textDecoration: 'none', 
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                Add to Calendar
              </a>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '30px', padding: '20px', background: '#fef3c7', borderRadius: '8px' }}>
        <h3 style={{ marginTop: 0 }}>Manual Setup (If Links Don't Work)</h3>
        <ol style={{ lineHeight: '1.8' }}>
          <li>Open your calendar (Google, Outlook, Apple)</li>
          <li>Create a new recurring event</li>
          <li>Set the time and days as shown above</li>
          <li>Add this dashboard URL in the description: <code>https://tpn-execution-dashboard.vercel.app</code></li>
          <li>Set reminders (15 min before each block)</li>
        </ol>
      </div>

      <div style={{ marginTop: '30px', padding: '20px', background: '#dcfce7', borderRadius: '8px' }}>
        <h3 style={{ marginTop: 0 }}>Pro Tips</h3>
        <ul style={{ lineHeight: '1.8' }}>
          <li><strong>Mark as "Busy"</strong> — Don't let meetings override revenue time</li>
          <li><strong>Set phone to Do Not Disturb</strong> — During call blocks</li>
          <li><strong>End each block with 5-min review</strong> — What worked? What didn't?</li>
          <li><strong>Adjust if needed</strong> — If 8am doesn't work, try 9am or 2pm</li>
        </ul>
      </div>
    </div>
  )
}

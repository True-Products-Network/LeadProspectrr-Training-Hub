export default function EmailAuditFollowup() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <a href="/" style={{ color: '#2563eb', textDecoration: 'none' }}>← Back to Dashboard</a>
      
      <h1 style={{ marginTop: '20px' }}>Audit Follow-Up Email</h1>
      <p style={{ color: '#666' }}>Send 2 days after delivering the video audit</p>
      
      <div style={{ background: '#f3f4f6', padding: '15px', borderRadius: '8px', margin: '20px 0' }}>
        <strong>Subject:</strong> Quick question about your Digital Audit
      </div>

      <div style={{ lineHeight: '1.8', whiteSpace: 'pre-wrap', background: '#fff', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
{`Hi [First Name],

I sent you a Digital Audit video a couple of days ago — wanted to check if you had a chance to watch it.

If you did: Did anything surprise you? Most people tell me they knew something was off but couldn't put their finger on exactly what.

If you didn't: No worries, I know you're busy. The video is 10 minutes and will show you exactly where you're losing time and money. Worth a look when you have a moment.

Either way, if you have questions or want to talk through implementing any of the fixes I mentioned, just reply. Happy to jump on a quick call.

If this isn't a priority right now, I get it. Just reply "not now" and I'll check back in a few months.

Talk soon,
Nigel Lear
Founder, True Products Network

P.S. — The leaks I found in your system? They're costing you about [SPECIFIC ESTIMATE] per month. The fixes? Most take less than a week to implement.`}
      </div>

      <div style={{ marginTop: '30px', padding: '20px', background: '#fef3c7', borderRadius: '8px' }}>
        <h3 style={{ marginTop: 0 }}>How to Use This Email</h3>
        <ol style={{ lineHeight: '1.8' }}>
          <li>Send 2 days after delivering the video audit</li>
          <li>Add a specific estimate in the P.S. (e.g., "20 hours per month" or "$3,000 in lost leads")</li>
          <li>Keep it low pressure — give them an easy out ("not now")</li>
          <li>Track responses: interested / not now / no reply</li>
        </ol>
      </div>

      <div style={{ marginTop: '20px', padding: '20px', background: '#dbeafe', borderRadius: '8px' }}>
        <h3 style={{ marginTop: 0 }}>Why This Works</h3>
        <ul style={{ lineHeight: '1.8' }}>
          <li>Assumes they might not have watched (removes guilt)</li>
          <li>Low friction — just reply, no booking link pressure</li>
          <li>Gives an easy out ("not now") which actually increases response rate</li>
          <li>P.S. creates urgency with specific numbers</li>
          <li>Short and casual — feels like a real person, not automation</li>
        </ul>
      </div>

      <div style={{ marginTop: '30px', padding: '20px', background: '#f0fdf4', borderRadius: '8px' }}>
        <h3 style={{ marginTop: 0 }}>If They Reply "Not Now"</h3>
        <p>Send this:</p>
        <div style={{ background: 'white', padding: '15px', borderRadius: '4px', marginTop: '10px', fontStyle: 'italic' }}>
          "No problem, [Name]. I'll reach back out in a few months. If anything changes before then, just reply."
        </div>
        <p style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
          Then set a reminder to follow up in 90 days.
        </p>
      </div>
    </div>
  )
}

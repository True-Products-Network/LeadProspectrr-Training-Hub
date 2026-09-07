export default function Audit() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <a href="/" style={{ color: '#2563eb', textDecoration: 'none' }}>← Back to Dashboard</a>
      
      <h1 style={{ marginTop: '20px' }}>Digital Audit</h1>
      <p style={{ color: '#666' }}>Questionnaire and process for complimentary audits</p>

      <div style={{ marginTop: '30px', padding: '20px', background: '#dbeafe', borderRadius: '8px' }}>
        <h2 style={{ marginTop: 0, color: '#0891b2' }}>What is a Digital Audit?</h2>
        <p>A 10-minute video walkthrough where I review their current tools, find the leaks, and show exactly where they're losing time and money.</p>
        <p><strong>No pitch. No pressure.</strong> Just a clear picture of what's broken and how to fix it.</p>
      </div>

      <div style={{ marginTop: '30px', padding: '20px', background: '#dcfce7', borderRadius: '8px' }}>
        <h2 style={{ marginTop: 0 }}>📝 Online Questionnaire</h2>
        <p>Send prospects this link to fill out directly:</p>
        <code style={{ background: 'white', padding: '10px', borderRadius: '4px', display: 'block', marginTop: '10px' }}>
          https://tpn-execution-dashboard.vercel.app/audit-form
        </code>
        <a 
          href="/audit-form"
          style={{ 
            display: 'inline-block', 
            marginTop: '15px',
            background: '#16a34a', 
            color: 'white', 
            padding: '10px 20px', 
            textDecoration: 'none', 
            borderRadius: '4px',
            fontSize: '14px'
          }}
        >
          Preview Form
        </a>
      </div>

      <div style={{ marginTop: '30px', padding: '20px', background: '#fef3c7', borderRadius: '8px' }}>
        <h2 style={{ marginTop: 0 }}>✅ Audit Checklist</h2>
        <p>Printable checklist for creating your 10-minute video walkthrough:</p>
        <ul style={{ lineHeight: '1.8', marginTop: '10px' }}>
          <li>Pre-record research (5 min)</li>
          <li>Loom setup guide</li>
          <li>10-minute structure with scripts</li>
          <li>Common leaks reference</li>
          <li>Post-record quality check</li>
        </ul>
        <a 
          href="/audit-checklist.md"
          target="_blank"
          rel="noopener noreferrer"
          style={{ 
            display: 'inline-block', 
            marginTop: '15px',
            background: '#ea580c', 
            color: 'white', 
            padding: '10px 20px', 
            textDecoration: 'none', 
            borderRadius: '4px',
            fontSize: '14px'
          }}
        >
          Download Checklist
        </a>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h2>Questionnaire Questions (Reference)</h2>
        <p style={{ color: '#666', fontSize: '14px' }}>What prospects answer in the form:</p>
        
        <div style={{ background: '#f3f4f6', padding: '20px', borderRadius: '8px', marginTop: '15px' }}>
          <ol style={{ lineHeight: '2' }}>
            <li>What type of business are you in? (industry, size, revenue)</li>
            <li>What tools are you currently using for:
              <ul style={{ lineHeight: '1.8' }}>
                <li>CRM / Contact management</li>
                <li>Email marketing</li>
                <li>Booking / Scheduling</li>
                <li>Lead capture (forms, landing pages)</li>
                <li>Follow-up automation</li>
              </ul>
            </li>
            <li>What's your biggest frustration with your current setup?</li>
            <li>How are you currently getting leads? (referrals, ads, events, etc.)</li>
            <li>What's working well that you don't want to change?</li>
            <li>What's the #1 thing you wish your systems did better?</li>
            <li>Are you the decision maker for system changes, or is there someone else involved?</li>
          </ol>
        </div>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h2>How to Deliver the Audit</h2>
        <div style={{ background: '#fef3c7', padding: '20px', borderRadius: '8px' }}>
          <ol style={{ lineHeight: '1.8' }}>
            <li><strong>Receive questionnaire</strong> — Review their answers</li>
            <li><strong>Research</strong> — Check their website, social, any public tools they're using</li>
            <li><strong>Record 10-min video</strong> — Use Loom or similar
              <ul>
                <li>Start with what they're doing well</li>
                <li>Point out 2-3 specific leaks or inefficiencies</li>
                <li>Show exactly how you'd fix each one</li>
                <li>End with clear next steps (if they want help)</li>
              </ul>
            </li>
            <li><strong>Send video + summary</strong> — Within 48 hours of receiving questionnaire</li>
            <li><strong>Follow up</strong> — 2 days later to see if they have questions</li>
          </ol>
        </div>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h2>Audit Delivery Email Template</h2>
        <div style={{ background: '#f3f4f6', padding: '20px', borderRadius: '8px', whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>
{`Subject: Your Digital Audit is ready

Hey [Name],

I just finished reviewing your systems and recorded a 10-minute walkthrough for you.

[VIDEO LINK]

Quick summary of what I found:

✅ What's working well:
- [Point 1]
- [Point 2]

⚠️ Where you're leaking time/money:
- [Issue 1] — Here's how to fix it: [solution]
- [Issue 2] — Here's how to fix it: [solution]

If you want help implementing any of this, just reply and we'll set up a time to talk through it.

If not, no worries — you now have a clear roadmap either way.

Talk soon,
Nigel`}
        </div>
      </div>

      <div style={{ marginTop: '30px', padding: '20px', background: '#dcfce7', borderRadius: '8px' }}>
        <h3 style={{ marginTop: 0 }}>The Goal</h3>
        <p>Deliver so much value in 10 minutes that they either:</p>
        <ol>
          <li>Want to hire you immediately, OR</li>
          <li>Refer you to someone who does</li>
        </ol>
        <p><strong>Only 3 audits per week.</strong> Make each one count.</p>
      </div>
    </div>
  )
}

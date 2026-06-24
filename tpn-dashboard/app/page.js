export default function Home() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <header style={{ borderBottom: '2px solid #333', paddingBottom: '20px', marginBottom: '30px' }}>
        <h1 style={{ margin: 0, fontSize: '28px' }}>True Products Network</h1>
        <p style={{ margin: '10px 0 0 0', color: '#666' }}>Daily Execution Dashboard</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        
        {/* Daily Non-Negotiables */}
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>
          <h2 style={{ marginTop: 0, color: '#2563eb' }}>Daily Non-Negotiables</h2>
          <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
            <li>☐ Send 1 email to list (8:00-8:30am)</li>
            <li>☐ Make 5 outreach calls (8:30-9:30am)</li>
            <li>☐ Follow up on yesterday's calls (9:30-10:00am)</li>
            <li>☐ Create 1 piece of content (10:00-11:00am)</li>
          </ul>
          <p style={{ fontSize: '14px', color: '#666', marginTop: '15px' }}>
            <strong>Total: 3 hours</strong> of revenue-generating activity
          </p>
        </div>

        {/* This Week's Email */}
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>
          <h2 style={{ marginTop: 0, color: '#16a34a' }}>Email Templates</h2>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
            Ready-to-send emails for your outreach.
          </p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <a 
              href="/email-week-1" 
              style={{ 
                display: 'inline-block', 
                background: '#16a34a', 
                color: 'white', 
                padding: '10px 20px', 
                textDecoration: 'none', 
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              Weekly Email #1
            </a>
            <a 
              href="/email-audit-followup" 
              style={{ 
                display: 'inline-block', 
                background: '#ea580c', 
                color: 'white', 
                padding: '10px 20px', 
                textDecoration: 'none', 
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              Audit Follow-Up
            </a>
          </div>
        </div>

        {/* Numbers */}
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>
          <h2 style={{ marginTop: 0, color: '#dc2626' }}>Your Numbers</h2>
          <div style={{ lineHeight: '1.8' }}>
            <p><strong>Target:</strong> $84,000/month</p>
            <p><strong>Current Offers:</strong></p>
            <ul style={{ paddingLeft: '20px', margin: '5px 0' }}>
              <li>Done For You: $5,000/mo</li>
              <li>DIY: $20K + $2,497/mo</li>
            </ul>
            <p><strong>Email List:</strong> 10,000 contacts</p>
            <p><strong>Need:</strong> ~17 clients/year at $5K/mo</p>
          </div>
        </div>

        {/* Outreach Scripts */}
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>
          <h2 style={{ marginTop: 0, color: '#9333ea' }}>Outreach Scripts</h2>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
            Cold call opener and follow-up sequences.
          </p>
          <a 
            href="/scripts" 
            style={{ 
              display: 'inline-block', 
              background: '#9333ea', 
              color: 'white', 
              padding: '10px 20px', 
              textDecoration: 'none', 
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            View Scripts
          </a>
        </div>

        {/* Weekly Structure */}
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>
          <h2 style={{ marginTop: 0, color: '#ea580c' }}>Weekly Structure</h2>
          <ul style={{ paddingLeft: '20px', lineHeight: '1.8', fontSize: '14px' }}>
            <li><strong>Monday:</strong> Planning & Outreach Blitz</li>
            <li><strong>Tuesday:</strong> Sales & Calls</li>
            <li><strong>Wednesday:</strong> Content & Authority</li>
            <li><strong>Thursday:</strong> Systems & Delivery</li>
            <li><strong>Friday:</strong> Follow-Up & Close</li>
          </ul>
        </div>

        {/* Digital Audit */}
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>
          <h2 style={{ marginTop: 0, color: '#0891b2' }}>Digital Audit</h2>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
            Questionnaire and process for complimentary audits.
          </p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <a 
              href="/audit" 
              style={{ 
                display: 'inline-block', 
                background: '#0891b2', 
                color: 'white', 
                padding: '10px 20px', 
                textDecoration: 'none', 
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              View Materials
            </a>
            <a 
              href="/audit-form" 
              style={{ 
                display: 'inline-block', 
                background: '#16a34a', 
                color: 'white', 
                padding: '10px 20px', 
                textDecoration: 'none', 
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              Open Form
            </a>
          </div>
        </div>

        {/* Tracking Spreadsheet */}
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>
          <h2 style={{ marginTop: 0, color: '#dc2626' }}>Tracking</h2>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
            Daily metrics, pipeline, and weekly scorecard.
          </p>
          <a 
            href="/tracking" 
            style={{ 
              display: 'inline-block', 
              background: '#dc2626', 
              color: 'white', 
              padding: '10px 20px', 
              textDecoration: 'none', 
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            View Tracker
          </a>
        </div>

        {/* Pricing Sheet */}
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>
          <h2 style={{ marginTop: 0, color: '#16a34a' }}>Pricing</h2>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
            Complete products & services price sheet.
          </p>
          <a 
            href="/pricing" 
            style={{ 
              display: 'inline-block', 
              background: '#16a34a', 
              color: 'white', 
              padding: '10px 20px', 
              textDecoration: 'none', 
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            View Pricing
          </a>
        </div>

        {/* Calendar Integration */}
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>
          <h2 style={{ marginTop: 0, color: '#2563eb' }}>📅 Calendar</h2>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
            Auto-add daily activities to your calendar.
          </p>
          <a 
            href="/calendar" 
            style={{ 
              display: 'inline-block', 
              background: '#2563eb', 
              color: 'white', 
              padding: '10px 20px', 
              textDecoration: 'none', 
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            Setup Calendar
          </a>
        </div>

      </div>

      <footer style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #ddd', color: '#666', fontSize: '14px' }}>
        <p>True Products Network LLC | Nigel Lear, Founder</p>
        <p>Target: $84K/month | Mode: Do and Report</p>
      </footer>
    </div>
  )
}

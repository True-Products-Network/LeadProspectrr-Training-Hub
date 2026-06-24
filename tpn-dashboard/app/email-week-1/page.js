'use client'

import { useState } from 'react'

export default function EmailWeek1() {
  const [selectedSubject, setSelectedSubject] = useState('Most businesses are leaking money (here\'s where to look)')

  const subjectLines = [
    { label: 'Original', text: 'Most businesses are leaking money (here\'s where to look)' },
    { label: 'Curiosity', text: 'Your systems are costing you more than you think' },
    { label: 'Story', text: 'I was paying for 4 tools to do one job' },
    { label: 'Direct', text: 'Free Digital Audit: Find your system\'s leaks' },
    { label: 'Urgency', text: '3 Digital Audits available this week' },
    { label: 'Warning', text: 'Before you buy another software tool...' }
  ]

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <a href="/" style={{ color: '#2563eb', textDecoration: 'none' }}>← Back to Dashboard</a>
      
      <h1 style={{ marginTop: '20px' }}>Weekly Email #1</h1>
      <p style={{ color: '#666' }}>The Digital Audit Invitation</p>

      <div style={{ marginTop: '30px', padding: '20px', background: '#fef3c7', borderRadius: '8px' }}>
        <h3 style={{ marginTop: 0 }}>Choose Your Subject Line</h3>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
          Click to select. Different angles work for different audiences.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {subjectLines.map((subject) => (
            <button
              key={subject.label}
              onClick={() => setSelectedSubject(subject.text)}
              style={{
                padding: '12px 15px',
                border: selectedSubject === subject.text ? '2px solid #16a34a' : '1px solid #ddd',
                borderRadius: '6px',
                background: selectedSubject === subject.text ? '#f0fdf4' : 'white',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '14px'
              }}
            >
              <span style={{ 
                display: 'inline-block', 
                minWidth: '80px', 
                fontWeight: 'bold',
                color: selectedSubject === subject.text ? '#16a34a' : '#666'
              }}>
                {subject.label}
              </span>
              <span style={{ color: '#333' }}>{subject.text}</span>
              {selectedSubject === subject.text && (
                <span style={{ marginLeft: '10px', color: '#16a34a' }}>✓ Selected</span>
              )}
            </button>
          ))}
        </div>
      </div>
      
      <div style={{ background: '#f3f4f6', padding: '15px', borderRadius: '8px', margin: '20px 0' }}>
        <strong>Subject:</strong> {selectedSubject}
      </div>

      <div style={{ lineHeight: '1.8', whiteSpace: 'pre-wrap', background: '#fff', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
{`Hi [First Name],

I was looking at my own business last week and realized something:

**I had 4 different tools doing the same job.**

Calendly for booking. A spreadsheet for leads. Another app for follow-ups. And my CRM was basically a $297/month database nobody touched.

Sound familiar?

Most businesses I talk to are in the same boat. Scattered systems. Leads falling through cracks. Paying for tools that don't talk to each other.

**Here's the thing:** You don't need more software. You need your software to actually work together.

That's why I started doing something called a **Digital Audit**.

It's simple. I look at what you're using now, find the leaks, and show you exactly where you're losing time and money.

No pitch. No pressure. Just a clear picture of what's broken and how to fix it.

**Want one?** Hit reply with "AUDIT" and I'll send you a quick questionnaire. Takes 5 minutes. You'll get a 10-minute video walkthrough of your biggest opportunities within 48 hours.

Or book a time here: [CALENDAR LINK]

Talk soon,
Nigel Lear
Founder, True Products Network

P.S. — I only do 3 of these per week. If you want one this week, reply now.`}
      </div>

      <div style={{ marginTop: '30px', padding: '20px', background: '#fef3c7', borderRadius: '8px' }}>
        <h3 style={{ marginTop: 0 }}>How to Use This Email</h3>
        <ol style={{ lineHeight: '1.8' }}>
          <li>Select a subject line above</li>
          <li>Copy the text into your email platform</li>
          <li>Add your calendar link where it says [CALENDAR LINK]</li>
          <li>Send to your 10K list</li>
          <li>Track replies and bookings</li>
        </ol>
      </div>

      <div style={{ marginTop: '20px', padding: '20px', background: '#dbeafe', borderRadius: '8px' }}>
        <h3 style={{ marginTop: 0 }}>Subject Line Guide</h3>
        <ul style={{ lineHeight: '1.8' }}>
          <li><strong>Original:</strong> Safe, proven, curiosity-driven</li>
          <li><strong>Curiosity:</strong> Makes them wonder what they're missing</li>
          <li><strong>Story:</strong> Personal, relatable, builds trust</li>
          <li><strong>Direct:</strong> Clear offer, no mystery</li>
          <li><strong>Urgency:</strong> Scarcity drives action</li>
          <li><strong>Warning:</strong> Stops them before they make a mistake</li>
        </ul>
      </div>

      <div style={{ marginTop: '20px', padding: '20px', background: '#f0fdf4', borderRadius: '8px' }}>
        <h3 style={{ marginTop: 0 }}>Pro Tip: A/B Test</h3>
        <p>Send different subject lines to segments of your list:</p>
        <ul style={{ lineHeight: '1.8' }}>
          <li>Split your 10K list in half</li>
          <li>Subject A to 5K, Subject B to 5K</li>
          <li>See which gets more opens and replies</li>
          <li>Use the winner for future emails</li>
        </ul>
      </div>
    </div>
  )
}

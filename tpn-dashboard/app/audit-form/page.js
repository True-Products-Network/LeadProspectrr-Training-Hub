'use client'

import { useState } from 'react'

export default function AuditForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    industry: '',
    employees: '',
    revenue: '',
    crm: '',
    emailTool: '',
    bookingTool: '',
    leadCapture: '',
    followupTool: '',
    biggestFrustration: '',
    leadSource: '',
    workingWell: '',
    wishFor: '',
    decisionMaker: 'yes'
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Save to localStorage for now (in production, this would send to your backend)
    const submissions = JSON.parse(localStorage.getItem('audit-submissions') || '[]')
    submissions.push({
      ...formData,
      submittedAt: new Date().toISOString(),
      id: Date.now()
    })
    localStorage.setItem('audit-submissions', JSON.stringify(submissions))
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>✓</div>
        <h1 style={{ color: '#16a34a', marginBottom: '20px' }}>Thank You!</h1>
        <p style={{ fontSize: '18px', lineHeight: '1.6', color: '#333' }}>
          Your Digital Audit questionnaire has been submitted. 
        </p>
        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#666', marginTop: '20px' }}>
          I'll review your responses and send you a 10-minute video walkthrough within 48 hours.
        </p>
        <a 
          href="/" 
          style={{ 
            display: 'inline-block', 
            marginTop: '30px',
            background: '#2563eb', 
            color: 'white', 
            padding: '12px 24px', 
            textDecoration: 'none', 
            borderRadius: '6px',
            fontSize: '16px'
          }}
        >
          Back to Dashboard
        </a>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
      <a href="/" style={{ color: '#2563eb', textDecoration: 'none' }}>← Back to Dashboard</a>
      
      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <h1 style={{ margin: '0 0 10px 0' }}>Digital Audit Questionnaire</h1>
        <p style={{ color: '#666', fontSize: '16px' }}>
          Help me understand your current setup so I can find the leaks and show you exactly where you're losing time and money.
        </p>
        <p style={{ color: '#999', fontSize: '14px' }}>Takes about 5 minutes</p>
      </div>

      <form onSubmit={handleSubmit} style={{ marginTop: '30px' }}>
        
        {/* Contact Info */}
        <div style={{ background: '#f3f4f6', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3 style={{ marginTop: 0, color: '#2563eb' }}>About You</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Your Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Company Name</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Industry</label>
              <input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                placeholder="e.g., Consulting, Retail, Healthcare"
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Company Size</label>
              <select
                name="employees"
                value={formData.employees}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px' }}
              >
                <option value="">Select...</option>
                <option value="1-5">Just me / 1-5 people</option>
                <option value="6-20">6-20 employees</option>
                <option value="21-50">21-50 employees</option>
                <option value="50+">50+ employees</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Annual Revenue (approximate)</label>
            <select
              name="revenue"
              value={formData.revenue}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px' }}
            >
              <option value="">Select...</option>
              <option value="under-100k">Under $100K</option>
              <option value="100k-500k">$100K - $500K</option>
              <option value="500k-1m">$500K - $1M</option>
              <option value="1m-5m">$1M - $5M</option>
              <option value="5m+">$5M+</option>
            </select>
          </div>
        </div>

        {/* Current Tools */}
        <div style={{ background: '#f3f4f6', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3 style={{ marginTop: 0, color: '#2563eb' }}>Your Current Tools</h3>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>What are you currently using for:</p>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>CRM / Contact Management</label>
            <input
              type="text"
              name="crm"
              value={formData.crm}
              onChange={handleChange}
              placeholder="e.g., HubSpot, Salesforce, Excel, nothing"
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Email Marketing</label>
            <input
              type="text"
              name="emailTool"
              value={formData.emailTool}
              onChange={handleChange}
              placeholder="e.g., Mailchimp, ActiveCampaign, nothing"
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Booking / Scheduling</label>
            <input
              type="text"
              name="bookingTool"
              value={formData.bookingTool}
              onChange={handleChange}
              placeholder="e.g., Calendly, Acuity, phone calls"
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Lead Capture (forms, landing pages)</label>
            <input
              type="text"
              name="leadCapture"
              value={formData.leadCapture}
              onChange={handleChange}
              placeholder="e.g., WordPress forms, Unbounce, nothing"
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Follow-up Automation</label>
            <input
              type="text"
              name="followupTool"
              value={formData.followupTool}
              onChange={handleChange}
              placeholder="e.g., Automated emails, manual follow-up, nothing"
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px' }}
            />
          </div>
        </div>

        {/* Challenges & Goals */}
        <div style={{ background: '#f3f4f6', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3 style={{ marginTop: 0, color: '#2563eb' }}>Challenges & Goals</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>What's your biggest frustration with your current setup?</label>
            <textarea
              name="biggestFrustration"
              value={formData.biggestFrustration}
              onChange={handleChange}
              rows={3}
              placeholder="e.g., Leads fall through the cracks, too many manual tasks, tools don't talk to each other..."
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px', resize: 'vertical' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>How are you currently getting leads?</label>
            <textarea
              name="leadSource"
              value={formData.leadSource}
              onChange={handleChange}
              rows={2}
              placeholder="e.g., Referrals, trade shows, Facebook ads, cold outreach..."
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px', resize: 'vertical' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>What's working well that you don't want to change?</label>
            <textarea
              name="workingWell"
              value={formData.workingWell}
              onChange={handleChange}
              rows={2}
              placeholder="e.g., Our referral system, our sales process, our team..."
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px', resize: 'vertical' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>What's the #1 thing you wish your systems did better?</label>
            <textarea
              name="wishFor"
              value={formData.wishFor}
              onChange={handleChange}
              rows={2}
              placeholder="e.g., Automatic follow-up, better reporting, one dashboard to see everything..."
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px', resize: 'vertical' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500' }}>Are you the decision maker for system changes?</label>
            <div style={{ display: 'flex', gap: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="decisionMaker"
                  value="yes"
                  checked={formData.decisionMaker === 'yes'}
                  onChange={handleChange}
                  style={{ marginRight: '8px' }}
                />
                Yes, I decide
              </label>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="decisionMaker"
                  value="no"
                  checked={formData.decisionMaker === 'no'}
                  onChange={handleChange}
                  style={{ marginRight: '8px' }}
                />
                No, someone else is involved
              </label>
            </div>
          </div>
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '15px',
            background: '#16a34a',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Submit Questionnaire
        </button>

        <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px', color: '#666' }}>
          You'll receive your video audit within 48 hours.
        </p>
      </form>
    </div>
  )
}

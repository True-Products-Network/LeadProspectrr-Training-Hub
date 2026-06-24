'use client'

import { useState, useEffect } from 'react'

export default function Tracking() {
  // Get current week dates
  const getWeekDates = () => {
    const today = new Date()
    const dayOfWeek = today.getDay() // 0 = Sunday, 1 = Monday
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1) // Adjust to get Monday
    const monday = new Date(today.setDate(diff))
    
    const dates = []
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
    for (let i = 0; i < 5; i++) {
      const date = new Date(monday)
      date.setDate(monday.getDate() + i)
      dates.push({
        day: days[i],
        date: date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' }),
        fullDate: date.toISOString().split('T')[0]
      })
    }
    return dates
  }

  const [weekDates, setWeekDates] = useState([])
  const [activities, setActivities] = useState({})
  const [pipeline, setPipeline] = useState([])
  const [notes, setNotes] = useState('')
  const [showReview, setShowReview] = useState(false)

  // Initialize on client side
  useEffect(() => {
    setWeekDates(getWeekDates())
    
    // Load saved data
    const savedActivities = localStorage.getItem('tpn-activities')
    const savedPipeline = localStorage.getItem('tpn-pipeline')
    const savedNotes = localStorage.getItem('tpn-notes')
    
    if (savedActivities) setActivities(JSON.parse(savedActivities))
    if (savedPipeline) setPipeline(JSON.parse(savedPipeline))
    if (savedNotes) setNotes(savedNotes)
  }, [])

  // Save activities when changed
  useEffect(() => {
    localStorage.setItem('tpn-activities', JSON.stringify(activities))
  }, [activities])

  useEffect(() => {
    localStorage.setItem('tpn-pipeline', JSON.stringify(pipeline))
  }, [pipeline])

  useEffect(() => {
    localStorage.setItem('tpn-notes', notes)
  }, [notes])

  const toggleActivity = (date, activity) => {
    const key = `${date}-${activity}`
    setActivities(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const addPipelineItem = () => {
    const newItem = {
      id: Date.now(),
      company: '',
      status: 'New Lead',
      lastContact: '',
      nextAction: '',
      value: ''
    }
    setPipeline([...pipeline, newItem])
  }

  const updatePipelineItem = (id, field, value) => {
    setPipeline(pipeline.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  const deletePipelineItem = (id) => {
    setPipeline(pipeline.filter(item => item.id !== id))
  }

  const calculateScorecard = () => {
    const totals = {
      emails: 0,
      calls: 0,
      followups: 0,
      content: 0,
      discovery: 0,
      proposals: 0,
      deals: 0
    }

    weekDates.forEach(({ fullDate }) => {
      if (activities[`${fullDate}-email`]) totals.emails++
      if (activities[`${fullDate}-calls`]) totals.calls += 5 // Assume 5 calls when checked
      if (activities[`${fullDate}-followup`]) totals.followups++
      if (activities[`${fullDate}-content`]) totals.content++
      if (activities[`${fullDate}-discovery`]) totals.discovery++
      if (activities[`${fullDate}-proposals`]) totals.proposals++
      if (activities[`${fullDate}-deals`]) totals.deals++
    })

    return totals
  }

  const downloadCSV = () => {
    const scorecard = calculateScorecard()
    
    // Activity data
    let csv = 'Date,Day,Email Sent,Calls Made,Follow-ups,Content Created,Discovery Calls,Proposals Sent,Deals Closed\n'
    weekDates.forEach(({ day, date, fullDate }) => {
      csv += `${fullDate},${day} ${date},`
      csv += `${activities[`${fullDate}-email`] ? 'Yes' : 'No'},`
      csv += `${activities[`${fullDate}-calls`] ? '5' : '0'},`
      csv += `${activities[`${fullDate}-followup`] ? 'Yes' : 'No'},`
      csv += `${activities[`${fullDate}-content`] ? 'Yes' : 'No'},`
      csv += `${activities[`${fullDate}-discovery`] ? 'Yes' : 'No'},`
      csv += `${activities[`${fullDate}-proposals`] ? 'Yes' : 'No'},`
      csv += `${activities[`${fullDate}-deals`] ? 'Yes' : 'No'}\n`
    })

    csv += '\nWeekly Scorecard\n'
    csv += `Metric,Actual,Goal\n`
    csv += `Emails Sent,${scorecard.emails},5\n`
    csv += `Calls Made,${scorecard.calls},25\n`
    csv += `Discovery Calls,${scorecard.discovery},3\n`
    csv += `Proposals Sent,${scorecard.proposals},-\n`
    csv += `Deals Closed,${scorecard.deals},-\n`

    csv += '\nPipeline\n'
    csv += 'Company,Status,Last Contact,Next Action,Potential Value\n'
    pipeline.forEach(item => {
      csv += `"${item.company}","${item.status}","${item.lastContact}","${item.nextAction}","${item.value}"\n`
    })

    csv += '\nNotes\n'
    csv += `"${notes}"\n`

    // Download
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `TPN-Weekly-Review-${weekDates[0]?.fullDate || 'current'}.csv`
    a.click()
  }

  const refreshWeek = () => {
    // Archive current week data
    const archive = {
      weekStarting: weekDates[0]?.fullDate,
      activities,
      pipeline,
      notes,
      scorecard: calculateScorecard()
    }
    
    const existingArchive = JSON.parse(localStorage.getItem('tpn-archive') || '[]')
    existingArchive.push(archive)
    localStorage.setItem('tpn-archive', JSON.stringify(existingArchive))

    // Clear current data
    setActivities({})
    setNotes('')
    // Keep pipeline but update dates
    
    // Refresh week dates
    setWeekDates(getWeekDates())
    
    setShowReview(false)
  }

  const scorecard = calculateScorecard()

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <a href="/" style={{ color: '#2563eb', textDecoration: 'none' }}>← Back to Dashboard</a>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
        <h1 style={{ margin: 0 }}>Tracking</h1>
        <button
          onClick={() => setShowReview(true)}
          style={{
            background: '#dc2626',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          Weekly Review
        </button>
      </div>

      {/* Daily Activity Tracker */}
      <div style={{ marginTop: '30px' }}>
        <h2>Daily Activity Tracker</h2>
        <p style={{ color: '#666', fontSize: '14px' }}>Click to check off each activity</p>
        
        <div style={{ overflowX: 'auto', marginTop: '15px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: '#f3f4f6' }}>
                <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Activity</th>
                {weekDates.map(({ day, date }) => (
                  <th key={day} style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>
                    {day}<br/>{date}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { key: 'email', label: '📧 Email Sent' },
                { key: 'calls', label: '📞 Calls Made (5)' },
                { key: 'followup', label: '🔄 Follow-ups' },
                { key: 'content', label: '✍️ Content Created' },
                { key: 'discovery', label: '🎯 Discovery Calls' },
                { key: 'proposals', label: '📄 Proposals Sent' },
                { key: 'deals', label: '💰 Deals Closed' }
              ].map(({ key, label }) => (
                <tr key={key}>
                  <td style={{ border: '1px solid #ddd', padding: '12px', fontWeight: '500' }}>{label}</td>
                  {weekDates.map(({ fullDate }) => (
                    <td key={`${fullDate}-${key}`} style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>
                      <button
                        onClick={() => toggleActivity(fullDate, key)}
                        style={{
                          width: '28px',
                          height: '28px',
                          border: '2px solid #2563eb',
                          borderRadius: '4px',
                          background: activities[`${fullDate}-${key}`] ? '#2563eb' : 'white',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto'
                        }}
                      >
                        {activities[`${fullDate}-${key}`] ? '✓' : ''}
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Weekly Scorecard */}
      <div style={{ marginTop: '40px', padding: '20px', background: '#dbeafe', borderRadius: '8px' }}>
        <h2 style={{ marginTop: 0 }}>Weekly Scorecard</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginTop: '15px' }}>
          <div style={{ background: 'white', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: scorecard.emails >= 5 ? '#16a34a' : '#2563eb' }}>
              {scorecard.emails}
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>Emails Sent</div>
            <div style={{ fontSize: '12px', color: '#999' }}>Goal: 5</div>
          </div>
          <div style={{ background: 'white', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: scorecard.calls >= 25 ? '#16a34a' : '#2563eb' }}>
              {scorecard.calls}
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>Calls Made</div>
            <div style={{ fontSize: '12px', color: '#999' }}>Goal: 25</div>
          </div>
          <div style={{ background: 'white', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: scorecard.discovery >= 3 ? '#16a34a' : '#2563eb' }}>
              {scorecard.discovery}
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>Discovery Calls</div>
            <div style={{ fontSize: '12px', color: '#999' }}>Goal: 3</div>
          </div>
          <div style={{ background: 'white', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#2563eb' }}>
              {scorecard.proposals}
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>Proposals Sent</div>
          </div>
          <div style={{ background: 'white', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: scorecard.deals > 0 ? '#16a34a' : '#2563eb' }}>
              {scorecard.deals}
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>Deals Closed</div>
          </div>
        </div>
      </div>

      {/* Pipeline */}
      <div style={{ marginTop: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Pipeline</h2>
          <button
            onClick={addPipelineItem}
            style={{
              background: '#16a34a',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            + Add Deal
          </button>
        </div>
        
        <div style={{ overflowX: 'auto', marginTop: '15px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: '#f3f4f6' }}>
                <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Company/Name</th>
                <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Status</th>
                <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Last Contact</th>
                <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Next Action</th>
                <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'right' }}>Value</th>
                <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}></th>
              </tr>
            </thead>
            <tbody>
              {pipeline.map(item => (
                <tr key={item.id}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    <input
                      type="text"
                      value={item.company}
                      onChange={(e) => updatePipelineItem(item.id, 'company', e.target.value)}
                      placeholder="Company name"
                      style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    <select
                      value={item.status}
                      onChange={(e) => updatePipelineItem(item.id, 'status', e.target.value)}
                      style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px' }}
                    >
                      <option>New Lead</option>
                      <option>Contacted</option>
                      <option>Audit Scheduled</option>
                      <option>Audit Completed</option>
                      <option>Proposal Sent</option>
                      <option>Negotiating</option>
                      <option>Closed Won</option>
                      <option>Closed Lost</option>
                    </select>
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    <input
                      type="text"
                      value={item.lastContact}
                      onChange={(e) => updatePipelineItem(item.id, 'lastContact', e.target.value)}
                      placeholder="e.g., 6/15"
                      style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    <input
                      type="text"
                      value={item.nextAction}
                      onChange={(e) => updatePipelineItem(item.id, 'nextAction', e.target.value)}
                      placeholder="e.g., Follow up 6/18"
                      style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    <input
                      type="text"
                      value={item.value}
                      onChange={(e) => updatePipelineItem(item.id, 'value', e.target.value)}
                      placeholder="e.g., $5K/mo"
                      style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px', textAlign: 'right' }}
                    />
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                    <button
                      onClick={() => deletePipelineItem(item.id)}
                      style={{
                        background: '#dc2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '6px 10px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notes */}
      <div style={{ marginTop: '40px' }}>
        <h2>Weekly Notes</h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="What worked? What didn't? Insights for next week..."
          style={{
            width: '100%',
            minHeight: '120px',
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '14px',
            fontFamily: 'inherit',
            resize: 'vertical'
          }}
        />
      </div>

      {/* Weekly Review Modal */}
      {showReview && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '12px',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h2 style={{ marginTop: 0 }}>Weekly Review</h2>
            
            <div style={{ marginTop: '20px' }}>
              <h3>This Week's Results:</h3>
              <ul style={{ lineHeight: '1.8' }}>
                <li>Emails Sent: {scorecard.emails} / 5</li>
                <li>Calls Made: {scorecard.calls} / 25</li>
                <li>Discovery Calls: {scorecard.discovery} / 3</li>
                <li>Proposals Sent: {scorecard.proposals}</li>
                <li>Deals Closed: {scorecard.deals}</li>
                <li>Active Pipeline: {pipeline.length} deals</li>
              </ul>
            </div>

            <div style={{ marginTop: '20px' }}>
              <p>Download this week's data and start fresh?</p>
              <p style={{ fontSize: '14px', color: '#666' }}>
                This will save your data locally and reset the tracker for next week.
              </p>
            </div>

            <div style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowReview(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  background: 'white',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={downloadCSV}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: 'none',
                  borderRadius: '6px',
                  background: '#2563eb',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                Download CSV
              </button>
              <button
                onClick={refreshWeek}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: 'none',
                  borderRadius: '6px',
                  background: '#16a34a',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                Start New Week
              </button>
            </div>
          </div>
        </div>
      )}

      <footer style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #ddd', color: '#666', fontSize: '14px' }}>
        <p>Data is saved locally in your browser. Weekly reviews archive your progress.</p>
      </footer>
    </div>
  )
}

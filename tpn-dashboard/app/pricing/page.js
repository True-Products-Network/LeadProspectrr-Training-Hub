export default function Pricing() {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <a href="/" style={{ color: '#2563eb', textDecoration: 'none' }}>← Back to Dashboard</a>
      
      <h1 style={{ marginTop: '20px' }}>Products & Services Price Sheet</h1>
      <p style={{ color: '#666' }}>True Products Network LLC — Complete pricing guide</p>

      <div style={{ marginTop: '30px', padding: '20px', background: '#dbeafe', borderRadius: '8px' }}>
        <h2 style={{ marginTop: 0, color: '#1e40af' }}>🎯 Target: $84,000/month</h2>
        <p>To hit your goal, you need a mix of:</p>
        <ul>
          <li><strong>~14 clients</strong> at $5,000/mo (Done For You)</li>
          <li><strong>OR ~34 clients</strong> at $2,497/mo (DIY)</li>
          <li><strong>OR a mix:</strong> 10 DFY + 14 DIY = $84,458/mo</li>
        </ul>
      </div>

      {/* Done For You */}
      <div style={{ marginTop: '40px', border: '2px solid #16a34a', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ background: '#16a34a', color: 'white', padding: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '24px' }}>Option 1: Done For You</h2>
          <p style={{ margin: '10px 0 0 0', opacity: 0.9 }}>We become your back-office digital operations team</p>
        </div>
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div>
              <h3 style={{ color: '#16a34a', marginTop: 0 }}>What's Included:</h3>
              <ul style={{ lineHeight: '1.8', paddingLeft: '20px' }}>
                <li>CRM setup & management</li>
                <li>Automation workflows</li>
                <li>Lead capture systems</li>
                <li>Follow-up sequences</li>
                <li>Messaging workflows</li>
                <li>Discovery sessions</li>
                <li>Daily platform management</li>
                <li>Monthly reporting</li>
              </ul>
            </div>
            <div>
              <h3 style={{ color: '#16a34a', marginTop: 0 }}>Investment:</h3>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#16a34a' }}>$5,000<span style={{ fontSize: '16px', color: '#666' }}>/month</span></div>
              <p style={{ color: '#666', fontSize: '14px' }}>$60,000/year • Minimum 12-month agreement</p>
              
              <div style={{ marginTop: '20px', padding: '15px', background: '#f0fdf4', borderRadius: '8px' }}>
                <strong>Setup Fee:</strong> $5,000 one-time<br/>
                <span style={{ fontSize: '14px', color: '#666' }}>Covers onboarding, discovery, initial build</span>
              </div>

              <div style={{ marginTop: '15px' }}>
                <p style={{ margin: '5px 0', fontSize: '14px' }}>✅ No employee benefits</p>
                <p style={{ margin: '5px 0', fontSize: '14px' }}>✅ No training or learning curve</p>
                <p style={{ margin: '5px 0', fontSize: '14px' }}>✅ Executing from day one</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DIY */}
      <div style={{ marginTop: '30px', border: '2px solid #9333ea', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ background: '#9333ea', color: 'white', padding: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '24px' }}>Option 2: Do It Yourself</h2>
          <p style={{ margin: '10px 0 0 0', opacity: 0.9 }}>Full platform access with White Glove Support</p>
        </div>
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div>
              <h3 style={{ color: '#9333ea', marginTop: 0 }}>What's Included:</h3>
              <ul style={{ lineHeight: '1.8', paddingLeft: '20px' }}>
                <li>Full platform access</li>
                <li>All tools & integrations</li>
                <li>Onboarding & setup support</li>
                <li>Step-by-step training</li>
                <li>White Glove Support</li>
                <li>Ongoing guidance</li>
                <li>Troubleshooting help</li>
                <li>Monthly strategy calls</li>
              </ul>
            </div>
            <div>
              <h3 style={{ color: '#9333ea', marginTop: 0 }}>Investment:</h3>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#9333ea' }}>$2,497<span style={{ fontSize: '16px', color: '#666' }}>/month</span></div>
              
              <div style={{ marginTop: '20px', padding: '15px', background: '#faf5ff', borderRadius: '8px' }}>
                <strong>Implementation Fee:</strong> $10,000 one-time<br/>
                <span style={{ fontSize: '14px', color: '#666' }}>Full setup, training, and handoff</span>
              </div>

              <div style={{ marginTop: '15px' }}>
                <p style={{ margin: '5px 0', fontSize: '14px' }}>✅ You control everything</p>
                <p style={{ margin: '5px 0', fontSize: '14px' }}>✅ Support when you need it</p>
                <p style={{ margin: '5px 0', fontSize: '14px' }}>✅ Lower monthly cost</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CRM Only */}
      <div style={{ marginTop: '30px', border: '2px solid #0891b2', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ background: '#0891b2', color: 'white', padding: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '24px' }}>Option 3: CRM Only</h2>
          <p style={{ margin: '10px 0 0 0', opacity: 0.9 }}>Platform access for teams who already have systems</p>
        </div>
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div>
              <h3 style={{ color: '#0891b2', marginTop: 0 }}>What's Included:</h3>
              <ul style={{ lineHeight: '1.8', paddingLeft: '20px' }}>
                <li>Full CRM platform access</li>
                <li>Contact management</li>
                <li>Basic automation tools</li>
                <li>Email integration</li>
                <li>Reporting dashboard</li>
                <li>1-hour weekly support clinic</li>
                <li>Community access</li>
              </ul>
            </div>
            <div>
              <h3 style={{ color: '#0891b2', marginTop: 0 }}>Investment:</h3>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#0891b2' }}>$297<span style={{ fontSize: '16px', color: '#666' }}>/month</span></div>
              
              <div style={{ marginTop: '20px', padding: '15px', background: '#ecfeff', borderRadius: '8px' }}>
                <strong>Setup Fee:</strong> $5,000 one-time<br/>
                <span style={{ fontSize: '14px', color: '#666' }}>Platform configuration and onboarding</span>
              </div>

              <div style={{ marginTop: '15px' }}>
                <p style={{ margin: '5px 0', fontSize: '14px' }}>✅ Bring your own team</p>
                <p style={{ margin: '5px 0', fontSize: '14px' }}>✅ Weekly group support</p>
                <p style={{ margin: '5px 0', fontSize: '14px' }}>✅ Lowest monthly cost</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Digital Audit */}
      <div style={{ marginTop: '30px', border: '2px solid #ea580c', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ background: '#ea580c', color: 'white', padding: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '24px' }}>🎯 Complimentary Digital Audit</h2>
          <p style={{ margin: '10px 0 0 0', opacity: 0.9 }}>See what's possible before you commit</p>
        </div>
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div>
              <h3 style={{ color: '#ea580c', marginTop: 0 }}>What You Get:</h3>
              <ul style={{ lineHeight: '1.8', paddingLeft: '20px' }}>
                <li>Review of current systems</li>
                <li>Identify leaks & inefficiencies</li>
                <li>10-minute video walkthrough</li>
                <li>Clear fix recommendations</li>
                <li>No pitch, no pressure</li>
              </ul>
            </div>
            <div>
              <h3 style={{ color: '#ea580c', marginTop: 0 }}>Investment:</h3>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#ea580c' }}>FREE</div>
              <p style={{ color: '#666', fontSize: '14px' }}>Limited to 3 per week</p>
              
              <div style={{ marginTop: '20px', padding: '15px', background: '#fff7ed', borderRadius: '8px' }}>
                <strong>How to Request:</strong><br/>
                Reply to any email with "AUDIT"<br/>
                Or book: [CALENDAR LINK]
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add-on Services */}
      <div style={{ marginTop: '40px' }}>
        <h2>Add-On Services</h2>
        <p style={{ color: '#666', fontSize: '14px' }}>Available for existing clients</p>
        
        <div style={{ overflowX: 'auto', marginTop: '15px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: '#f3f4f6' }}>
                <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Service</th>
                <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Description</th>
                <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>Price</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>Landing Page Build</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>Custom high-converting landing page (mini-website complexity)</td>
                <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>$2,500 - $3,500</td>
              </tr>
              <tr style={{ background: '#fafafa' }}>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>Essential Web Presence</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>3-5 page website, CMS, mobile responsive, basic SEO</td>
                <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>$5,000 - $7,500</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>Growth Website</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>5-10 page website, blog, integrations, custom design</td>
                <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>$7,500 - $15,000</td>
              </tr>
              <tr style={{ background: '#fafafa' }}>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>eCommerce Platform</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>Full online store, payments, inventory, memberships</td>
                <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>$15,000+</td>
              </tr>
              <tr style={{ background: '#fafafa' }}>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>Email Sequence</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>5-email nurture or sales sequence</td>
                <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>$1,500</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>Automation Workflow</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>Custom workflow build</td>
                <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>$1,000</td>
              </tr>
              <tr style={{ background: '#fafafa' }}>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>Strategy Session</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>90-minute deep-dive consultation</td>
                <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>$500</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>Additional User</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>Extra team member access</td>
                <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>$97/mo</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Reference */}
      <div style={{ marginTop: '40px', padding: '20px', background: '#f3f4f6', borderRadius: '8px' }}>
        <h2 style={{ marginTop: 0 }}>Quick Reference: Three Options</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginTop: '15px' }}>
          <div style={{ background: 'white', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #16a34a' }}>
            <strong style={{ color: '#16a34a' }}>Done For You</strong><br/>
            $5,000 setup + $5,000/mo<br/>
            <span style={{ fontSize: '12px', color: '#666' }}>We run everything</span>
          </div>
          <div style={{ background: 'white', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #9333ea' }}>
            <strong style={{ color: '#9333ea' }}>DIY + Support</strong><br/>
            $10,000 setup + $2,497/mo<br/>
            <span style={{ fontSize: '12px', color: '#666' }}>You run it, we support</span>
          </div>
          <div style={{ background: 'white', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #0891b2' }}>
            <strong style={{ color: '#0891b2' }}>CRM Only</strong><br/>
            $5,000 setup + $297/mo<br/>
            <span style={{ fontSize: '12px', color: '#666' }}>Platform + weekly clinic</span>
          </div>
        </div>
        <p style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
          <strong>Same $5K setup</strong> for DFY and CRM Only. <strong>$10K setup</strong> for DIY (deters tire kickers, serious commitment). 
          <strong>Monthly</strong> determines the relationship level.
        </p>
      </div>

      <div style={{ marginTop: '30px', padding: '20px', background: '#fef3c7', borderRadius: '8px' }}>
        <h3 style={{ marginTop: 0 }}>How to Use This Price Sheet</h3>
        <ol style={{ lineHeight: '1.8' }}>
          <li><strong>Always start with the Digital Audit</strong> — lowest friction entry point</li>
          <li><strong>Let them choose their level</strong> — same quality, different involvement</li>
          <li><strong>$10K DIY setup filters</strong> — serious players only, but not impossible</li>
          <li><strong>CRM Only for teams</strong> — they have staff, just need the platform</li>
        </ol>
      </div>
    </div>
  )
}

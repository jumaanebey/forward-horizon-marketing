'use client'

import { useEffect, useState } from 'react'
import NotificationSystem from '../components/NotificationSystem'

interface LogEntry {
  timestamp: string
  firstName: string
  email: string
  formType: 'veterans' | 'recovery' | 'reentry'
  source: string
}

interface DashboardStats {
  totalLeads: number
  todayLeads: number
  yesterdayLeads: number
  thisWeekLeads: number
  conversionRate: number
  veteransLeads: number
  recoveryLeads: number
  reentryLeads: number
}

export default function SimpleDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    todayLeads: 0,
    yesterdayLeads: 0,
    thisWeekLeads: 0,
    conversionRate: 0,
    veteransLeads: 0,
    recoveryLeads: 0,
    reentryLeads: 0,
  })
  const [recentLeads, setRecentLeads] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load leads from both API and localStorage  
    loadAllLeads()
    
    // Set up real-time updates
    const interval = setInterval(loadAllLeads, 30000) // Check every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const loadAllLeads = async () => {
    try {
      // Get leads from API (enhanced leads with risk assessment)
      const apiResponse = await fetch('/api/leads')
      const apiData = await apiResponse.json()
      
      // Get leads from localStorage (contact form submissions)
      const storedLeads = localStorage.getItem('captured_leads')
      const localLeads: LogEntry[] = storedLeads ? JSON.parse(storedLeads) : []
      
      // Combine API leads and local leads
      const allLeads = [...localLeads]
      
      // Add API leads to the mix (convert format)
      if (apiData.success && apiData.leads) {
        apiData.leads.forEach((apiLead: any) => {
          allLeads.push({
            timestamp: apiLead.created_at,
            firstName: apiLead.first_name,
            email: apiLead.email,
            formType: apiLead.inquiry_type,
            source: apiLead.lead_source || 'API'
          })
        })
      }
      
      const leads = allLeads

      // Calculate real statistics
      const now = new Date()
      const today = now.toISOString().split('T')[0]
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

      const todayLeads = leads.filter(lead => lead.timestamp.startsWith(today)).length
      const yesterdayLeads = leads.filter(lead => lead.timestamp.startsWith(yesterday)).length
      const thisWeekLeads = leads.filter(lead => new Date(lead.timestamp) >= weekAgo).length
      
      const veteransLeads = leads.filter(lead => lead.formType === 'veterans').length
      const recoveryLeads = leads.filter(lead => lead.formType === 'recovery').length
      const reentryLeads = leads.filter(lead => lead.formType === 'reentry').length

      // Estimated conversion rate (you can update this based on actual follow-up data)
      const conversionRate = leads.length > 0 ? 15 : 0 // 15% estimated

      setStats({
        totalLeads: leads.length,
        todayLeads,
        yesterdayLeads,
        thisWeekLeads,
        conversionRate,
        veteransLeads,
        recoveryLeads,
        reentryLeads,
      })

      // Show most recent leads
      setRecentLeads(leads.slice(-10).reverse())
      
    } catch (error) {
      console.error('Error loading leads:', error)
      // Initialize with empty data if loading fails
      setRecentLeads([])
    } finally {
      setLoading(false)
    }
  }

  // Function to manually add a test lead (for demonstration)
  const addTestLead = () => {
    const testLead: LogEntry = {
      timestamp: new Date().toISOString(),
      firstName: 'Test User',
      email: `test${Date.now()}@example.com`,
      formType: ['veterans', 'recovery', 'reentry'][Math.floor(Math.random() * 3)] as any,
      source: 'manual_test'
    }

    const existingLeads = localStorage.getItem('captured_leads')
    const leads = existingLeads ? JSON.parse(existingLeads) : []
    leads.push(testLead)
    localStorage.setItem('captured_leads', JSON.stringify(leads))
    
    loadAllLeads() // Refresh the display
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow h-32"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Forward Horizon Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">Real-time lead tracking and analytics</p>
            </div>
            <div className="flex items-center space-x-4">
              <NotificationSystem />
              <button
                onClick={addTestLead}
                className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700"
              >
                Add Test Lead
              </button>
              <button
                onClick={loadAllLeads}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Refresh Data
              </button>
              <a
                href="/dashboard/advanced"
                className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700"
              >
                Advanced Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="Total Leads"
            value={stats.totalLeads}
            icon="👥"
            change={`+${stats.todayLeads} today`}
            changeType="positive"
          />
          <StatCard
            title="This Week"
            value={stats.thisWeekLeads}
            icon="📅"
            change={`vs ${stats.yesterdayLeads} yesterday`}
            changeType="neutral"
          />
          <StatCard
            title="Conversion Rate"
            value={`${stats.conversionRate}%`}
            icon="📈"
            change="Estimated"
            changeType="neutral"
          />
          <StatCard
            title="Active Campaign"
            value="1"
            icon="🎯"
            change="Google Ads Live"
            changeType="positive"
          />
        </div>

        {/* Lead Source Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Leads by Type</h3>
            <div className="space-y-4">
              <LeadTypeBar label="Veterans" count={stats.veteransLeads} total={stats.totalLeads} color="bg-blue-500" />
              <LeadTypeBar label="Recovery" count={stats.recoveryLeads} total={stats.totalLeads} color="bg-green-500" />
              <LeadTypeBar label="Re-entry" count={stats.reentryLeads} total={stats.totalLeads} color="bg-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Campaign Performance</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Daily Budget</span>
                <span className="font-semibold">$26.74</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Est. Cost/Lead</span>
                <span className="font-semibold">$30</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Campaign Status</span>
                <span className="text-green-600 font-semibold">Active</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left px-3 py-2 text-sm border border-gray-200 rounded hover:bg-gray-50">
                📞 Follow up with new leads
              </button>
              <button className="w-full text-left px-3 py-2 text-sm border border-gray-200 rounded hover:bg-gray-50">
                📊 Check Google Ads performance
              </button>
              <button className="w-full text-left px-3 py-2 text-sm border border-gray-200 rounded hover:bg-gray-50">
                ✉️ Review email deliverability
              </button>
            </div>
          </div>
        </div>

        {/* Recent Leads */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Leads</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {recentLeads.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                <p>No leads captured yet.</p>
                <p className="text-sm mt-1">Leads will appear here when someone submits your marketing forms.</p>
              </div>
            ) : (
              recentLeads.map((lead, index) => (
                <div key={index} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getFormTypeColor(lead.formType)}`}></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{lead.firstName}</p>
                        <p className="text-sm text-gray-500">{lead.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-900 capitalize">{lead.formType}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(lead.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="text-lg font-medium text-blue-900 mb-2">📊 Real-Time Data</h4>
          <p className="text-blue-800 mb-4">
            This dashboard shows real leads from your marketing funnel. Data updates automatically as people submit forms.
          </p>
          <div className="space-y-2 text-sm text-blue-700">
            <p>• <strong>Total Leads:</strong> Count of all form submissions</p>
            <p>• <strong>Lead Types:</strong> Veterans, Recovery, and Re-entry forms</p>
            <p>• <strong>Real-time updates:</strong> Dashboard refreshes every 30 seconds</p>
            <p>• <strong>Data source:</strong> Direct from your marketing landing pages</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ 
  title, 
  value, 
  icon, 
  change, 
  changeType 
}: { 
  title: string
  value: string | number
  icon: string
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
}) {
  const changeColors = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600'
  }

  return (
    <div className="bg-white px-6 py-4 shadow rounded-lg">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="ml-4 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">{value}</div>
              <div className={`ml-2 text-sm font-medium ${changeColors[changeType]}`}>
                {change}
              </div>
            </dd>
          </dl>
        </div>
      </div>
    </div>
  )
}

function LeadTypeBar({ 
  label, 
  count, 
  total, 
  color 
}: { 
  label: string
  count: number
  total: number
  color: string
}) {
  const percentage = total > 0 ? (count / total) * 100 : 0

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium">{count}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${color}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  )
}

function getFormTypeColor(formType: string): string {
  switch (formType) {
    case 'veterans': return 'bg-blue-500'
    case 'recovery': return 'bg-green-500'
    case 'reentry': return 'bg-purple-500'
    default: return 'bg-gray-500'
  }
}
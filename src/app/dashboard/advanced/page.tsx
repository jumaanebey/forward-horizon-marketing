'use client'

import { useEffect, useState } from 'react'

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  inquiry_type: 'veterans' | 'recovery' | 'reentry';
  message: string;
  created_at: string;
  status: 'new' | 'contacted' | 'scheduled' | 'enrolled';
  risk_level: 'critical' | 'high' | 'moderate' | 'early';
  priority_score: number;
  location?: string;
  situation_keywords?: string[];
  response_time_needed: string;
  lead_source: string;
}

interface LeadStats {
  total: number;
  by_risk: {
    critical: number;
    high: number;
    moderate: number;
    early: number;
  };
  by_type: {
    veterans: number;
    recovery: number;
    reentry: number;
  };
  by_status: {
    new: number;
    contacted: number;
    scheduled: number;
    enrolled: number;
  };
}

export default function AdvancedDashboard() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [stats, setStats] = useState<LeadStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'critical' | 'high' | 'today'>('all')
  const [lastUpdated, setLastUpdated] = useState<string>('')

  useEffect(() => {
    loadLeads()
    
    // Auto-refresh every 30 seconds like foreclosure dashboard
    const interval = setInterval(loadLeads, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadLeads = async () => {
    try {
      const response = await fetch('/api/leads')
      const data = await response.json()
      
      if (data.success) {
        setLeads(data.leads)
        setStats(data.statistics)
        setLastUpdated(data.last_updated)
      }
    } catch (error) {
      console.error('Error loading leads:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredLeads = leads.filter(lead => {
    if (filter === 'all') return true
    if (filter === 'critical') return lead.risk_level === 'critical'
    if (filter === 'high') return lead.risk_level === 'high'
    if (filter === 'today') {
      const today = new Date().toISOString().split('T')[0]
      return lead.created_at.startsWith(today)
    }
    return true
  })

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'bg-red-500 text-white'
      case 'high': return 'bg-orange-500 text-white'
      case 'moderate': return 'bg-yellow-500 text-white'
      case 'early': return 'bg-green-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const getRiskEmoji = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return '🔴'
      case 'high': return '🟠'
      case 'moderate': return '🟡'
      case 'early': return '🟢'
      default: return '⚫'
    }
  }

  const getTypeEmoji = (type: string) => {
    switch (type) {
      case 'veterans': return '🇺🇸'
      case 'recovery': return '🌱'
      case 'reentry': return '🏠'
      default: return '👤'
    }
  }

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`
  }

  const handleEmail = (email: string) => {
    window.location.href = `mailto:${email}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-8">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded w-96 mb-8"></div>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold">Forward Horizon AI Lead Dashboard</h1>
          <p className="text-xl mt-2 text-blue-100">Real-time transitional housing lead management & risk assessment</p>
          <div className="mt-4 text-blue-200">
            Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleString() : 'Loading...'}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatCard
              title="🔴 Critical Risk"
              value={stats.by_risk.critical}
              subtitle="Immediate Response (15 min)"
              className="bg-red-500 text-white"
            />
            <StatCard
              title="🟠 High Risk"
              value={stats.by_risk.high}
              subtitle="Urgent Response (2 hours)"
              className="bg-orange-500 text-white"
            />
            <StatCard
              title="🟡 Moderate Risk"
              value={stats.by_risk.moderate}
              subtitle="Standard Response (24 hours)"
              className="bg-yellow-500 text-white"
            />
            <StatCard
              title="🟢 Early Stage"
              value={stats.by_risk.early}
              subtitle="Information Gathering (72 hours)"
              className="bg-green-500 text-white"
            />
          </div>
        )}

        {/* Filter Buttons */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-3">
            <FilterButton
              active={filter === 'all'}
              onClick={() => setFilter('all')}
              label={`All Leads (${leads.length})`}
            />
            <FilterButton
              active={filter === 'critical'}
              onClick={() => setFilter('critical')}
              label={`Critical Risk (${stats?.by_risk.critical || 0})`}
              className="bg-red-600 hover:bg-red-700"
            />
            <FilterButton
              active={filter === 'high'}
              onClick={() => setFilter('high')}
              label={`High Risk (${stats?.by_risk.high || 0})`}
              className="bg-orange-600 hover:bg-orange-700"
            />
            <FilterButton
              active={filter === 'today'}
              onClick={() => setFilter('today')}
              label="Today's Leads"
              className="bg-blue-600 hover:bg-blue-700"
            />
          </div>
        </div>

        {/* Leads Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Lead Management ({filteredLeads.length} leads)
          </h2>
          
          {filteredLeads.length === 0 ? (
            <div className="bg-white rounded-xl p-8 shadow text-center">
              <p className="text-gray-500 text-lg">No leads match the current filter.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredLeads.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onCall={handleCall}
                  onEmail={handleEmail}
                  getRiskColor={getRiskColor}
                  getRiskEmoji={getRiskEmoji}
                  getTypeEmoji={getTypeEmoji}
                />
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats Summary */}
        {stats && (
          <div className="mt-12 bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-3">By Program Type</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>🇺🇸 Veterans Housing</span>
                    <span className="font-semibold">{stats.by_type.veterans}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🌱 Recovery Housing</span>
                    <span className="font-semibold">{stats.by_type.recovery}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🏠 Re-entry Support</span>
                    <span className="font-semibold">{stats.by_type.reentry}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-3">By Status</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>New Leads</span>
                    <span className="font-semibold">{stats.by_status.new}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Contacted</span>
                    <span className="font-semibold">{stats.by_status.contacted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Scheduled</span>
                    <span className="font-semibold">{stats.by_status.scheduled}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Enrolled</span>
                    <span className="font-semibold">{stats.by_status.enrolled}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-3">Response Priority</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Immediate (15 min)</span>
                    <span className="font-semibold text-red-600">{stats.by_risk.critical}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Urgent (2 hours)</span>
                    <span className="font-semibold text-orange-600">{stats.by_risk.high}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Standard (24 hours)</span>
                    <span className="font-semibold text-yellow-600">{stats.by_risk.moderate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Planned (72 hours)</span>
                    <span className="font-semibold text-green-600">{stats.by_risk.early}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ 
  title, 
  value, 
  subtitle, 
  className = "bg-white" 
}: { 
  title: string
  value: number
  subtitle: string
  className?: string
}) {
  return (
    <div className={`p-6 rounded-xl shadow-lg ${className}`}>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <p className="text-sm opacity-90">{subtitle}</p>
    </div>
  )
}

function FilterButton({ 
  active, 
  onClick, 
  label, 
  className = "bg-gray-600 hover:bg-gray-700" 
}: { 
  active: boolean
  onClick: () => void
  label: string
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-white font-medium transition-colors ${
        active ? 'ring-2 ring-blue-300' : ''
      } ${className}`}
    >
      {label}
    </button>
  )
}

function LeadCard({ 
  lead, 
  onCall, 
  onEmail, 
  getRiskColor, 
  getRiskEmoji, 
  getTypeEmoji 
}: { 
  lead: Lead
  onCall: (phone: string) => void
  onEmail: (email: string) => void
  getRiskColor: (risk: string) => string
  getRiskEmoji: (risk: string) => string
  getTypeEmoji: (type: string) => string
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className={`px-3 py-1 rounded-full text-sm font-bold ${getRiskColor(lead.risk_level)}`}>
            {getRiskEmoji(lead.risk_level)} {lead.risk_level.toUpperCase()} RISK
          </div>
          <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            Score: {lead.priority_score}
          </div>
        </div>
        <div className="text-right text-sm text-gray-500">
          {new Date(lead.created_at).toLocaleString()}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {getTypeEmoji(lead.inquiry_type)} {lead.first_name} {lead.last_name}
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div>📧 {lead.email}</div>
            <div>📱 {lead.phone}</div>
            <div>📍 {lead.location}</div>
            <div>🔗 {lead.lead_source}</div>
          </div>
          
          <div className="mt-4">
            <span className="text-sm font-medium text-gray-700">Program: </span>
            <span className="text-sm text-gray-900 capitalize">{lead.inquiry_type} Housing</span>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Situation Description</h4>
          <p className="text-sm text-gray-700 mb-3">{lead.message}</p>
          
          {lead.situation_keywords && lead.situation_keywords.length > 0 && (
            <div className="mb-3">
              <span className="text-sm font-medium text-gray-700">Detected Keywords: </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {lead.situation_keywords.map((keyword, i) => (
                  <span key={i} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="text-sm">
            <span className="font-medium text-gray-700">Response Time Needed: </span>
            <span className="text-red-600 font-semibold">{lead.response_time_needed}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex space-x-3">
        <button
          onClick={() => onCall(lead.phone)}
          className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          📞 Call Now
        </button>
        <button
          onClick={() => onEmail(lead.email)}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          ✉️ Send Email
        </button>
      </div>
    </div>
  )
}
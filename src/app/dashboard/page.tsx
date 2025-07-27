'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import type { Lead, Campaign } from '../../../lib/supabase'

interface DashboardStats {
  totalLeads: number
  newLeads: number
  qualifiedLeads: number
  convertedLeads: number
  costPerLead: number
  conversionRate: number
  todayLeads: number
  activeCampaigns: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    newLeads: 0,
    qualifiedLeads: 0,
    convertedLeads: 0,
    costPerLead: 0,
    conversionRate: 0,
    todayLeads: 0,
    activeCampaigns: 0,
  })
  const [recentLeads, setRecentLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch leads statistics
      const { data: leads } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })

      if (leads) {
        const today = new Date().toISOString().split('T')[0]
        const todayLeads = leads.filter(lead => 
          lead.created_at.startsWith(today)
        ).length

        const newLeads = leads.filter(lead => lead.status === 'new').length
        const qualifiedLeads = leads.filter(lead => lead.status === 'qualified').length
        const convertedLeads = leads.filter(lead => lead.status === 'converted').length
        
        const conversionRate = leads.length > 0 ? (convertedLeads / leads.length) * 100 : 0
        const avgCostPerLead = leads.reduce((sum, lead) => sum + lead.lead_value, 0) / leads.length || 0

        setStats({
          totalLeads: leads.length,
          newLeads,
          qualifiedLeads,
          convertedLeads,
          costPerLead: avgCostPerLead,
          conversionRate,
          todayLeads,
          activeCampaigns: 0, // Will update with campaigns data
        })

        setRecentLeads(leads.slice(0, 5))
      }

      // Fetch active campaigns
      const { data: campaigns } = await supabase
        .from('campaigns')
        .select('*')
        .eq('status', 'active')

      if (campaigns) {
        setStats(prev => ({ ...prev, activeCampaigns: campaigns.length }))
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow h-32"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">Dashboard Overview</h1>
          <p className="mt-2 text-sm text-gray-700">
            Real-time analytics and lead management for Forward Horizon
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Leads"
          value={stats.totalLeads}
          icon="👥"
          change="+12%"
          changeType="positive"
        />
        <StatCard
          title="New Leads"
          value={stats.newLeads}
          icon="🆕"
          change={`${stats.todayLeads} today`}
          changeType="neutral"
        />
        <StatCard
          title="Conversion Rate"
          value={`${stats.conversionRate.toFixed(1)}%`}
          icon="📈"
          change="+2.3%"
          changeType="positive"
        />
        <StatCard
          title="Cost per Lead"
          value={`$${stats.costPerLead.toFixed(0)}`}
          icon="💰"
          change="-$5"
          changeType="positive"
        />
      </div>

      {/* Recent Leads and Quick Actions */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Recent Leads */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Leads</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(lead.status)}`}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{lead.first_name}</p>
                      <p className="text-sm text-gray-500">{lead.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-900 capitalize">{lead.form_type}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 border-t border-gray-200">
            <a
              href="/dashboard/leads"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              View all leads →
            </a>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6 space-y-4">
            <QuickActionButton
              title="Add New Lead"
              description="Manually add a lead to the system"
              icon="➕"
              href="/dashboard/leads/new"
            />
            <QuickActionButton
              title="View Analytics"
              description="Check campaign performance"
              icon="📊"
              href="/dashboard/analytics"
            />
            <QuickActionButton
              title="Manage Campaigns"
              description="Update ad campaigns and budgets"
              icon="🎯"
              href="/dashboard/campaigns"
            />
            <QuickActionButton
              title="Email Sequences"
              description="Review automated email performance"
              icon="✉️"
              href="/dashboard/emails"
            />
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

function QuickActionButton({ 
  title, 
  description, 
  icon, 
  href 
}: { 
  title: string
  description: string
  icon: string
  href: string
}) {
  return (
    <a
      href={href}
      className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
    >
      <span className="text-xl mr-3">{icon}</span>
      <div>
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </a>
  )
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'new': return 'bg-blue-500'
    case 'contacted': return 'bg-yellow-500'
    case 'qualified': return 'bg-green-500'
    case 'converted': return 'bg-purple-500'
    case 'lost': return 'bg-red-500'
    default: return 'bg-gray-500'
  }
}
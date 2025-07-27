'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../../lib/supabase'
import type { Lead } from '../../../../lib/supabase'

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedFormType, setSelectedFormType] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchLeads()
  }, [])

  useEffect(() => {
    filterLeads()
  }, [leads, selectedStatus, selectedFormType, searchTerm])

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      if (data) setLeads(data)
    } catch (error) {
      console.error('Error fetching leads:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterLeads = () => {
    let filtered = leads

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(lead => lead.status === selectedStatus)
    }

    if (selectedFormType !== 'all') {
      filtered = filtered.filter(lead => lead.form_type === selectedFormType)
    }

    if (searchTerm) {
      filtered = filtered.filter(lead =>
        lead.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredLeads(filtered)
  }

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ 
          status: newStatus,
          last_contacted: newStatus === 'contacted' ? new Date().toISOString() : undefined
        })
        .eq('id', leadId)

      if (error) throw error

      // Update local state
      setLeads(leads.map(lead => 
        lead.id === leadId 
          ? { ...lead, status: newStatus as Lead['status'] }
          : lead
      ))
    } catch (error) {
      console.error('Error updating lead status:', error)
    }
  }

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
          <div className="bg-white rounded-lg shadow h-96"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">Lead Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage and track all leads from your marketing campaigns
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            Export Leads
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">
              Search
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Name or email..."
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>
          </div>
          <div>
            <label htmlFor="form-type" className="block text-sm font-medium text-gray-700">
              Form Type
            </label>
            <select
              id="form-type"
              value={selectedFormType}
              onChange={(e) => setSelectedFormType(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="all">All Types</option>
              <option value="veterans">Veterans</option>
              <option value="recovery">Recovery</option>
              <option value="reentry">Re-entry</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSelectedStatus('all')
                setSelectedFormType('all')
                setSearchTerm('')
              }}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredLeads.length} of {leads.length} leads
        </div>
      </div>

      {/* Leads Table */}
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Lead
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Value
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center">
                          <div className={`h-3 w-3 rounded-full mr-3 ${getStatusColor(lead.status)}`} />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{lead.first_name}</div>
                            <div className="text-sm text-gray-500">{lead.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold ${getFormTypeColor(lead.form_type)}`}>
                          {lead.form_type}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        <select
                          value={lead.status}
                          onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                          className="text-sm border-0 bg-transparent focus:ring-0 capitalize"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="qualified">Qualified</option>
                          <option value="converted">Converted</option>
                          <option value="lost">Lost</option>
                        </select>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        ${lead.lead_value}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button className="text-blue-600 hover:text-blue-900 mr-4">
                          View
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          Contact
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
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

function getFormTypeColor(formType: string): string {
  switch (formType) {
    case 'veterans': return 'bg-blue-100 text-blue-800'
    case 'recovery': return 'bg-green-100 text-green-800'
    case 'reentry': return 'bg-purple-100 text-purple-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}
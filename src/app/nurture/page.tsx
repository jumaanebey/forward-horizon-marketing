'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface NurtureStatus {
  id: string;
  name: string;
  program: string;
  riskScore: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  nextAction: string;
  createdAt: string;
  hoursSinceCreated: number;
}

interface NurtureSummary {
  total: number;
  needingAttention: number;
}

export default function NurturePage() {
  const [leads, setLeads] = useState<NurtureStatus[]>([]);
  const [summary, setSummary] = useState<NurtureSummary>({ total: 0, needingAttention: 0 });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);

  const fetchNurtureStatus = async () => {
    try {
      const response = await fetch('/api/nurture-leads');
      const data = await response.json();
      
      if (data.success) {
        setLeads(data.leads);
        setSummary(data.summary);
      }
    } catch (error) {
      console.error('Error fetching nurture status:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerNurturing = async () => {
    setProcessing(true);
    try {
      const response = await fetch('/api/nurture-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'nurture_recent' })
      });
      
      const result = await response.json();
      if (result.success) {
        alert(`Nurturing completed! ${result.summary.emailsSent} emails sent.`);
        fetchNurtureStatus();
      }
    } catch (error) {
      console.error('Error triggering nurturing:', error);
      alert('Failed to trigger nurturing process');
    } finally {
      setProcessing(false);
    }
  };

  const sendNurtureEmail = async (leadId: string, templateType: string) => {
    setSendingEmail(leadId);
    try {
      const response = await fetch('/api/nurture-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'send_email', 
          leadId, 
          templateType 
        })
      });
      
      const result = await response.json();
      if (result.success) {
        alert(`Email sent successfully to ${result.leadId}`);
      } else {
        alert('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email');
    } finally {
      setSendingEmail(null);
    }
  };

  useEffect(() => {
    fetchNurtureStatus();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchNurtureStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return '🚨';
      case 'high': return '🔥';
      case 'medium': return '⚠️';
      case 'low': return '📋';
      default: return '📝';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lead nurturing dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">🎯 Lead Nurturing Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage and nurture your recent leads</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-blue-600 hover:text-blue-800">
                ← Back to Dashboard
              </Link>
              <button
                onClick={triggerNurturing}
                disabled={processing}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {processing ? 'Processing...' : '🚀 Start Nurturing'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Summary Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Recent Leads</h3>
                <p className="text-3xl font-bold text-blue-600">{summary.total}</p>
                <p className="text-sm text-gray-500">Last 7 days</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Need Attention</h3>
                <p className="text-3xl font-bold text-red-600">{summary.needingAttention}</p>
                <p className="text-sm text-gray-500">Overdue for contact</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🚨</span>
              </div>
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-lg border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Recent Leads to Nurture</h2>
            <p className="text-gray-600 mt-1">Sorted by priority - handle critical leads first</p>
          </div>

          {leads.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Recent Leads</h3>
              <p className="text-gray-600">No leads in the last 7 days. When you get new leads, they will appear here for nurturing.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Action</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quick Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                          <div className="text-sm text-gray-500">Risk Score: {lead.riskScore}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{lead.program}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(lead.priority)}`}>
                          {getPriorityIcon(lead.priority)} {lead.priority.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">{lead.nextAction}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {lead.hoursSinceCreated < 24 ? 
                            `${lead.hoursSinceCreated}h ago` : 
                            `${Math.floor(lead.hoursSinceCreated / 24)}d ago`
                          }
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => sendNurtureEmail(lead.id, 'immediate')}
                            disabled={sendingEmail === lead.id}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium disabled:opacity-50"
                          >
                            {sendingEmail === lead.id ? '⏳' : '📧'} Email
                          </button>
                          <a 
                            href="tel:+1-310-488-5280"
                            className="text-green-600 hover:text-green-800 text-sm font-medium"
                          >
                            📞 Call
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Action Guide */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">📋 Nurturing Action Guide</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-blue-800 mb-2">🚨 Critical Priority:</h4>
              <ul className="space-y-1 text-blue-700">
                <li>• Call immediately (within 15 minutes)</li>
                <li>• Send personalized email if no answer</li>
                <li>• Follow up every 2-4 hours until contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">🔥 High Priority:</h4>
              <ul className="space-y-1 text-blue-700">
                <li>• Call within 2 hours</li>
                <li>• Send immediate response email</li>
                <li>• Schedule follow-up for next day</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">⚠️ Medium Priority:</h4>
              <ul className="space-y-1 text-blue-700">
                <li>• Call within 4 hours</li>
                <li>• Send welcome email series</li>
                <li>• Follow up in 24-48 hours</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">📋 Low Priority:</h4>
              <ul className="space-y-1 text-blue-700">
                <li>• Call within 8 hours</li>
                <li>• Send informational materials</li>
                <li>• Follow up in 3-5 days</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
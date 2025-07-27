'use client'

import { useEffect, useState } from 'react'

interface Notification {
  id: string
  type: 'new_lead' | 'email_delivered' | 'campaign_update'
  title: string
  message: string
  timestamp: string
  read: boolean
}

export default function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    // Load existing notifications
    loadNotifications()
    
    // Check for new leads every 30 seconds
    const interval = setInterval(checkForNewLeads, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const loadNotifications = () => {
    try {
      const stored = localStorage.getItem('dashboard_notifications')
      const notifications = stored ? JSON.parse(stored) : []
      setNotifications(notifications)
      setUnreadCount(notifications.filter((n: Notification) => !n.read).length)
    } catch (error) {
      console.error('Error loading notifications:', error)
    }
  }

  const checkForNewLeads = () => {
    try {
      // Check if there are new leads since last check
      const lastCheck = localStorage.getItem('last_notification_check')
      const lastCheckTime = lastCheck ? new Date(lastCheck) : new Date(Date.now() - 24 * 60 * 60 * 1000)
      
      const leads = localStorage.getItem('captured_leads')
      const leadsList = leads ? JSON.parse(leads) : []
      
      const newLeads = leadsList.filter((lead: any) => 
        new Date(lead.timestamp) > lastCheckTime
      )

      if (newLeads.length > 0) {
        // Create notifications for new leads
        newLeads.forEach((lead: any) => {
          addNotification({
            type: 'new_lead',
            title: 'New Lead Captured!',
            message: `${lead.firstName} (${lead.email}) submitted ${lead.formType} form`,
            timestamp: lead.timestamp
          })
        })
        
        // Update last check time
        localStorage.setItem('last_notification_check', new Date().toISOString())
      }
    } catch (error) {
      console.error('Error checking for new leads:', error)
    }
  }

  const addNotification = (notification: Omit<Notification, 'id' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      read: false
    }

    const updatedNotifications = [newNotification, ...notifications].slice(0, 50) // Keep last 50
    setNotifications(updatedNotifications)
    setUnreadCount(prev => prev + 1)
    
    // Save to localStorage
    localStorage.setItem('dashboard_notifications', JSON.stringify(updatedNotifications))
    
    // Show browser notification if permission granted
    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico'
      })
    }
  }

  const markAsRead = (notificationId: string) => {
    const updated = notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    )
    setNotifications(updated)
    setUnreadCount(updated.filter(n => !n.read).length)
    localStorage.setItem('dashboard_notifications', JSON.stringify(updated))
  }

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }))
    setNotifications(updated)
    setUnreadCount(0)
    localStorage.setItem('dashboard_notifications', JSON.stringify(updated))
  }

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }

  useEffect(() => {
    // Request notification permission on component mount
    requestNotificationPermission()
  }, [])

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Mark all read
                </button>
              )}
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <p>No notifications yet</p>
                <p className="text-sm mt-1">You'll see lead updates here</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {notification.type === 'new_lead' && <span>👤</span>}
                      {notification.type === 'email_delivered' && <span>✉️</span>}
                      {notification.type === 'campaign_update' && <span>📈</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => setShowNotifications(false)}
                className="w-full text-center text-sm text-gray-600 hover:text-gray-700"
              >
                Close
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
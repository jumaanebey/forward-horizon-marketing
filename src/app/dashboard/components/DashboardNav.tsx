'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: '📊' },
  { name: 'Leads', href: '/dashboard/leads', icon: '👥' },
  { name: 'Analytics', href: '/dashboard/analytics', icon: '📈' },
  { name: 'Campaigns', href: '/dashboard/campaigns', icon: '🎯' },
  { name: 'Email Sequences', href: '/dashboard/emails', icon: '✉️' },
  { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
]

export default function DashboardNav() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile sidebar */}
      <div className={`lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <span className="text-white text-xl">✕</span>
              </button>
            </div>
            <SidebarContent pathname={pathname} />
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200 px-6 pb-4">
          <SidebarContent pathname={pathname} />
        </div>
      </div>

      {/* Mobile header */}
      <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:hidden">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <span className="text-xl">☰</span>
        </button>
        <div className="h-6 w-px bg-gray-200 lg:hidden" />
        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <div className="flex flex-1 items-center">
            <h1 className="text-lg font-semibold text-gray-900">Forward Horizon Dashboard</h1>
          </div>
        </div>
      </div>
    </>
  )
}

function SidebarContent({ pathname }: { pathname: string }) {
  return (
    <>
      <div className="flex h-16 shrink-0 items-center">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">FH</span>
          </div>
          <span className="text-xl font-bold text-gray-900">Forward Horizon</span>
        </div>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`
                      group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold
                      ${pathname === item.href
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                      }
                    `}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          <li className="mt-auto">
            <div className="flex items-center gap-x-4 px-2 py-3 text-sm font-semibold leading-6 text-gray-900">
              <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-sm">👤</span>
              </div>
              <span className="sr-only">Your profile</span>
              <span aria-hidden="true">Admin User</span>
            </div>
          </li>
        </ul>
      </nav>
    </>
  )
}
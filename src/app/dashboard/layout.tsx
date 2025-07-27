import { Metadata } from 'next'
import DashboardNav from './components/DashboardNav'

export const metadata: Metadata = {
  title: 'Forward Horizon - Dashboard',
  description: 'Lead management and business analytics dashboard',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      <main className="lg:pl-64">
        <div className="py-6">
          {children}
        </div>
      </main>
    </div>
  )
}
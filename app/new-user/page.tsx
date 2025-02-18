'use client'

import NewUserForm from '../../components/admin/NewUserForm'

export default function NewUser() {
  return (
    <div>
        <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-card shadow-lg rounded-lg overflow-hidden">
                <div className="p-6 space-y-6">
                <h1 className="text-3xl font-bold text-center">Admin Dashboard</h1>
                <NewUserForm />
                </div>
            </div>
        </main>
    </div>
  )
}
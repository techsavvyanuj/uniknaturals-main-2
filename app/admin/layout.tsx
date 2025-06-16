'use client';

import { ReactNode } from 'react';
import { AdminAuthProvider } from '@/hooks/useAdminAuth';
import AdminNavbar from './components/AdminNavbar';

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AdminAuthProvider>
      <div className="min-h-screen flex flex-col">
        <AdminNavbar />
        <main className="flex-grow container mx-auto p-4 mt-28">
          {children}
        </main>
      </div>
    </AdminAuthProvider>
  );
} 
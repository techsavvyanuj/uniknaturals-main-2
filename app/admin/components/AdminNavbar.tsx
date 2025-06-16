'use client';

import Link from 'next/link';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { usePathname } from 'next/navigation';

export default function AdminNavbar() {
  const { logout, isAuthenticated } = useAdminAuth();
  const pathname = usePathname();
  
  // Don't show navbar on login page
  if (pathname === '/admin/login') {
    return null;
  }

  return (
    <header className="bg-sage text-white p-4 sticky top-10 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Uniknaturals Admin</h1>
        {isAuthenticated && (
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link
                  href="/admin"
                  className={`hover:underline ${
                    pathname === '/admin' ? 'font-bold underline' : ''
                  }`}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/products"
                  className={`hover:underline ${
                    pathname.startsWith('/admin/products') ? 'font-bold underline' : ''
                  }`}
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/images"
                  className={`hover:underline ${
                    pathname.startsWith('/admin/images') ? 'font-bold underline' : ''
                  }`}
                >
                  Images
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:underline">
                  View Site
                </Link>
              </li>
              <li>
                <button onClick={logout} className="hover:underline">
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
} 
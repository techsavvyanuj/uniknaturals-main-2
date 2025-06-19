"use client";

import Link from "next/link";

export default function SectionsAdminPage() {
  return (
    <div className="container py-12">
      <h1 className="text-2xl font-bold mb-6">Homepage Sections Admin</h1>
      <ul className="space-y-4">
        <li>
          <Link
            href="/admin/trending-products"
            className="text-sage underline"
          >
            Manage Trending Products
          </Link>
        </li>
      </ul>
    </div>
  );
}

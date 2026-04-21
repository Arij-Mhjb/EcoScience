// Layout protégé pour l'espace admin

import { redirect } from 'next/navigation';
import { getAdminFromCookie } from '@/lib/adminAuth';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdminFromCookie();

  // Si pas authentifié, redirection vers login
  if (!admin) {
    redirect('/admin/login');
  }

  const adminName = admin.name ?? 'Admin';
  const adminEmail = admin.email ?? '';

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader adminName={adminName} adminEmail={adminEmail} />
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}

import type { JSX, ReactNode } from 'react';

import { requireAdmin } from '@/lib/auth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

import styles from './layout.module.css';

type AdminLayoutProps = {
  children: ReactNode;
};

const AdminLayout = async ({ children }: AdminLayoutProps): Promise<JSX.Element> => {
  await requireAdmin();

  return (
    <div className={styles.shell}>
      <AdminSidebar />
      <main className={styles.content}>{children}</main>
    </div>
  );
};

export default AdminLayout;

import type { JSX, ReactNode } from 'react';

import { requireAdmin } from '@/lib/auth';

type AdminLayoutProps = {
  children: ReactNode;
};

const AdminLayout = async ({ children }: AdminLayoutProps): Promise<JSX.Element> => {
  await requireAdmin();
  return <div>{children}</div>;
};

export default AdminLayout;

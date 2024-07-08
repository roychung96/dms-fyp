// app/admin/layout.tsx

import React from 'react';
import Navbar from './components/Navbar'; // Example: Custom Navbar for admin

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

export default AdminLayout;

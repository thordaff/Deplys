'use client';

import { usePathname } from 'next/navigation';
import Navbar from '../../pages/components/_navbar';
import Footer from '../../pages/components/_footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '';
  const isAuthPath = pathname === '/Auth';

  return (
    <>
      {!isAuthPath && <Navbar />} {/* Render Navbar jika bukan path Auth */}
      {children}
      {!isAuthPath && <Footer />} {/* Render Footer jika bukan path Auth */}
    </>
  );
}

import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import AstroChatWidget from '@/components/chat/AstroChatWidget';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col starfield-bg">
      <Navbar />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
      <AstroChatWidget />
    </div>
  );
};

export default Layout;

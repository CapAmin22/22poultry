
import React, { ReactNode, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSidebar } from '@/contexts/SidebarContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const { sidebarOpen, setSidebarOpen, toggleSidebar } = useSidebar();

  // Effect to close sidebar when in mobile view and window resizes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setSidebarOpen]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar - controlled by sidebarOpen state */}
      {!isMobile && (
        <div className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden`}>
          <div className={`fixed inset-y-0 left-0 z-20 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300`}>
            <Sidebar open={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          </div>
        </div>
      )}

      {/* Mobile Sidebar (with overlay) */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar - slide in */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 z-40"
          >
            <Sidebar open={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col transition-all duration-300">
        <div className="sticky top-0 z-30">
          <Navbar />
        </div>

        <main className="flex-1 transition-all duration-300"> 
          <div className="container mx-auto px-4 py-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </div>
        </main>

        {/* Floating hamburger button - only shown on mobile when sidebar is closed */}
        <div className="fixed bottom-4 right-4 z-50 md:hidden shadow-lg">
          <Button
            onClick={toggleSidebar}
            className={`rounded-full shadow-lg p-3 h-12 w-12 ${
              sidebarOpen 
                ? 'bg-red-100 text-[#ea384c] hover:bg-red-200' 
                : 'bg-[#ea384c] text-white hover:bg-[#d22f42]'
            }`}
          >
            {sidebarOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Layout;

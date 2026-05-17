
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  TrendingUp, 
  User,
  X,
  ChevronLeft,
  Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSidebar } from '@/contexts/SidebarContext';
import { useI18n, SUPPORTED_LANGUAGES } from '@/i18n/i18n';

interface NavItem {
  name: string;
  icon: React.ReactNode;
  href: string;
}

interface SidebarProps {
  open: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, setSidebarOpen }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { language, setLanguage, t } = useI18n();

  const navigation: NavItem[] = [
    { name: t('nav.dashboard'), icon: <LayoutDashboard className="h-5 w-5" />, href: '/dashboard' },
    { name: t('nav.marketplace'), icon: <ShoppingCart className="h-5 w-5" />, href: '/marketplace' },
    { name: t('nav.neccAnalytics'), icon: <TrendingUp className="h-5 w-5" />, href: '/necc-analytics' },
    { name: t('nav.profile'), icon: <User className="h-5 w-5" />, href: '/profile' },
  ];

  const handleNavigate = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className={`h-screen w-64 bg-white border-r border-gray-200 flex flex-col ${isMobile ? 'shadow-xl' : ''}`}>
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        <Link to="/dashboard" className="flex items-center">
          <img 
            src="/lovable-uploads/c9a1b8a4-493d-4cb1-a1ea-8d2f8d5735a1.png" 
            alt="22POULTRY" 
            className="h-8 w-8 mr-2"
          />
          <h1 className="text-xl font-bold bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] bg-clip-text text-transparent">
            22POULTRY
          </h1>
        </Link>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setSidebarOpen(false)}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Close sidebar"
        >
          {isMobile ? <X className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto pt-5 px-3">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;

          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={handleNavigate}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-md transition-all duration-200 mb-1 ${
                isActive 
                  ? 'bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] text-white shadow-md' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Language Selector + Footer */}
      <div className="px-3 py-4 border-t border-gray-200 space-y-3">
        {/* Quick language toggle */}
        <div className="flex items-center gap-1 justify-center">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                language === lang.code
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`}
            >
              {lang.nativeName}
            </button>
          ))}
        </div>
        <div className="text-center text-xs text-gray-400">
          <p>© 2026 22POULTRY</p>
          <p className="mt-0.5">Empowering poultry farmers</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

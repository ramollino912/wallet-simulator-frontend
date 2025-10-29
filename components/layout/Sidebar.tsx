'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  CreditCard, 
  Receipt, 
  Bus, 
  User, 
  LogOut,
  Menu,
  X,
  Wallet,
  ChevronLeft,
  ChevronRight,
  ArrowRightLeft,
  DollarSign,
  HelpCircle,
  History
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { useState, useEffect } from 'react';
import { useSidebarContext } from '@/app/(dashboard)/layout';

const navigation = [
  { name: 'Home', href: '/home', icon: Home },
  { name: 'Transferir', href: '/transferir', icon: ArrowRightLeft },
  { name: 'Ingresar', href: '/ingresar', icon: DollarSign },
  { name: 'SUBE', href: '/sube', icon: Bus },
  { name: 'Historial', href: '/historial', icon: History },
  { name: 'Servicios', href: '/servicios', icon: CreditCard },
  { name: 'Perfil', href: '/perfil', icon: User },
  { name: 'Ayuda', href: '/ayuda', icon: HelpCircle },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isCollapsed, setIsCollapsed } = useSidebarContext();

  // Log para debug
  useEffect(() => {
    console.log('Sidebar - Usuario actualizado:', user);
    console.log('Sidebar - Saldo:', user?.saldo);
  }, [user]);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 bg-slate-900 text-white transform transition-all duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isCollapsed ? 'w-20' : 'w-64'}
          lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Collapse button for desktop */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex absolute -right-3 top-6 bg-slate-800 hover:bg-slate-700 rounded-full h-6 w-6 z-50 border border-slate-700"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
          {/* Logo */}
          <div className={`flex items-center gap-2 px-6 py-6 border-b border-slate-800 ${isCollapsed ? 'justify-center' : ''}`}>
            <Wallet className="h-8 w-8 text-blue-400" />
            {!isCollapsed && (
              <div>
                <h1 className="text-xl font-bold">Wallet TIC</h1>
                <p className="text-xs text-slate-400">Tu billetera digital</p>
              </div>
            )}
          </div>

          {/* User Info */}
          {user && !isCollapsed && (
            <div className="px-6 py-4 border-b border-slate-800">
              <p className="text-sm font-medium">{user.nombre}</p>
              <p className="text-xs text-slate-400">{user.email}</p>
              <p className="text-lg font-bold text-green-400 mt-2">
                ${typeof user.saldo === 'number' ? user.saldo.toFixed(2) : Number(user.saldo || 0).toFixed(2)}
              </p>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${isCollapsed ? 'justify-center' : ''}
                    ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }
                  `}
                  title={isCollapsed ? item.name : ''}
                >
                  <item.icon className="h-5 w-5" />
                  {!isCollapsed && <span className="font-medium">{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="px-4 py-4 border-t border-slate-800">
            <Button
              variant="ghost"
              className={`w-full text-slate-300 hover:bg-red-600 hover:text-white ${isCollapsed ? 'justify-center px-0' : 'justify-start'}`}
              onClick={handleLogout}
              title={isCollapsed ? 'Cerrar Sesión' : ''}
            >
              <LogOut className={`h-5 w-5 ${!isCollapsed ? 'mr-3' : ''}`} />
              {!isCollapsed && 'Cerrar Sesión'}
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}

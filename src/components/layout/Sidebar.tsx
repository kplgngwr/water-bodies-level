'use client';

import { 
  Home, 
  Map, 
  BarChart3, 
  AlertTriangle, 
  Activity, 
  Database, 
  FileText, 
  Settings,
  Waves
} from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  current: string;
  onNavigate: (href: string) => void;
}

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
}

const navItems: NavItem[] = [
  { icon: Home, label: 'Dashboard', href: '/' },
  { icon: Map, label: 'Map Explorer', href: '/map' },
  { icon: BarChart3, label: 'Analytics', href: '/analytics' },
  { icon: AlertTriangle, label: 'Alerts Center', href: '/alerts' },
  { icon: Activity, label: 'Device Ops', href: '/devices' },
  { icon: Database, label: 'Data Quality', href: '/quality' },
  { icon: FileText, label: 'Reports', href: '/reports' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function Sidebar({ current, onNavigate }: SidebarProps) {
  // Start collapsed (icons only); expand on hover
  const [collapsed, setCollapsed] = useState(true);

  return (
    <aside
      className={`${collapsed ? 'w-20' : 'w-64'} shrink-0 h-screen sticky top-0 p-3 bg-zinc-900 text-zinc-100 border-r border-zinc-800 transition-all duration-300 hidden lg:block overflow-hidden`}
      onMouseEnter={() => setCollapsed(false)}
      onMouseLeave={() => setCollapsed(true)}
    >
      <div className="flex items-center gap-3 px-2 py-3 mb-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white">
          <Waves size={20} />
        </div>
        {!collapsed && <span className="font-semibold text-lg">WaterSense</span>}
      </div>
      
      <nav className="flex flex-col gap-1 text-sm">
        {navItems.map((item) => {
          const active = item.href === current;
          return (
            <button
              key={item.href}
              onClick={() => onNavigate(item.href)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-800/60 transition-all ${
                active ? 'bg-zinc-800/80 text-sky-400' : 'text-zinc-300'
              }`}
              title={collapsed ? item.label : undefined}
              aria-current={active ? 'page' : undefined}
            >
              <item.icon size={20} className="shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
        
        <div className="pt-3 mt-3 border-t border-zinc-800">
          <div className="flex items-center gap-2 px-3 py-2 text-xs opacity-70">
            <Map size={14} className="shrink-0" />
            {!collapsed && <span>Powered by Mapbox</span>}
          </div>
        </div>
      </nav>
    </aside>
  );
}

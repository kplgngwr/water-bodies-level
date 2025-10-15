'use client';

import { Bell, Menu, CloudRain, Radio, User } from 'lucide-react';

export default function Topbar() {
  return (
    <header className="h-14 sticky top-0 z-50 backdrop-blur-md bg-zinc-900/75 border-b border-zinc-800 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-3 text-zinc-300">
        <button className="lg:hidden p-2 hover:bg-zinc-800 rounded-lg transition-colors">
          <Menu size={20} />
        </button>
        <span className="text-sm opacity-80 hidden sm:inline">Water Bodies Intelligence Portal</span>
      </div>
      
      <div className="flex items-center gap-3 md:gap-4 text-sm">
        <div className="hidden md:flex items-center gap-4 md:gap-6 text-zinc-300">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-zinc-800 transition-colors">
            <CloudRain size={16} />
            <span className="text-xs">Rain Overlay</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-zinc-800 transition-colors">
            <Radio size={16} />
            <span className="text-xs">Live Feed</span>
          </button>
        </div>
        
        <button className="relative p-2 rounded-lg hover:bg-zinc-800 transition-colors">
          <Bell size={18} />
          <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 bg-rose-600 rounded-full pulse-glow" />
        </button>
        
        <div className="flex items-center gap-2 ml-2">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-sky-500 to-sky-700 grid place-items-center text-white">
            <User size={16} />
          </div>
          <div className="leading-tight text-right hidden sm:block">
            <div className="text-zinc-100 text-sm font-medium">Operator</div>
            <div className="text-xs text-zinc-400">Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
}

import React from 'react';
import { Store, ChevronLeft, ChevronRight } from 'lucide-react';

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

interface SidebarProps {
  menuItems: MenuItem[];
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ menuItems, isCollapsed, onToggleCollapse }: SidebarProps) {
  return (
    <div 
      className={`
        ${isCollapsed ? 'w-20' : 'w-64'} 
        bg-amazon-brown
        transition-all duration-300 ease-in-out relative
        border-r border-amazon-orange/20
        flex flex-col
        min-h-screen
      `}
    >
      {/* Header section */}
      <div className="p-4 border-b border-amazon-orange/20">
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <Store size={32} className="min-w-[32px] text-amazon-orange" />
          <span className={`text-xl font-bold transition-opacity duration-300 text-white ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'}`}>
            ScanList.pro
          </span>
        </div>
      </div>

      {/* Navigation section */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-hide">
        {menuItems.map((item, index) => (
          <a
            key={index}
            href="#"
            onClick={item.onClick}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg
              transition-all duration-200
              ${item.active 
                ? 'bg-amazon-orange text-white' 
                : 'text-white/70 hover:bg-amazon-orange/20 hover:text-white'}
              ${item.className || ''}
              ${isCollapsed ? 'justify-center' : ''}
            `}
          >
            <div className="min-w-[20px] flex items-center justify-center">
              {item.icon}
            </div>
            <span className={`transition-opacity duration-300 font-medium ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'}`}>
              {item.label}
            </span>
          </a>
        ))}
      </nav>

      <button
        onClick={onToggleCollapse}
        className="
          absolute -right-4 top-8 p-2 rounded-full
          bg-amazon-orange text-white
          shadow-lg hover:bg-amazon-orangeLight
          transition-all duration-200
          border border-white/10
        "
      >
        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>
    </div>
  );
}
import React, { useState } from 'react';
import {
  LayoutGrid,
  Package,
  Settings,
  Upload,
  Table,
  ClipboardList,
  LogOut,
  Database,
} from 'lucide-react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { ProductsOverview } from './ProductsOverview';
import { ExcelUploadModal } from './ExcelUploadModal';
import TableView from './TableView';
import { TasksView } from './TasksView';
import { TablesView } from './TablesView';
import { SettingsView } from './SettingsView';

interface DashboardLayoutProps {
  onLogout: () => void;
}

export function DashboardLayout({ onLogout }: DashboardLayoutProps) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const navigate = useNavigate();

  // Add event listener for the upload modal
  React.useEffect(() => {
    const handleOpenUploadModal = () => setIsUploadModalOpen(true);
    window.addEventListener('openUploadModal', handleOpenUploadModal);
    return () => window.removeEventListener('openUploadModal', handleOpenUploadModal);
  }, []);

  const handleDataImport = (data: any[]) => {
    setProducts(data);
    navigate('table');
  };

  const handleViewTable = (data: any[]) => {
    setProducts(data);
    navigate('table');
  };

  const menuItems = [
    {
      icon: <LayoutGrid size={20} />,
      label: 'Dashboard',
      onClick: () => navigate(''),
    },
    {
      icon: <Upload size={20} />,
      label: 'Upload List',
      onClick: () => setIsUploadModalOpen(true),
      className: 'bg-amazon-orange/10',
    },
    {
      icon: <Table size={20} />,
      label: 'Table View',
      onClick: () => navigate('table'),
    },
    {
      icon: <Database size={20} />,
      label: 'Tablas',
      onClick: () => navigate('tables'),
    },
    { icon: <Package size={20} />, label: 'Products' },
    {
      icon: <ClipboardList size={20} />,
      label: 'Tasks',
      onClick: () => navigate('tasks'),
    },
    {
      icon: <Settings size={20} />,
      label: 'Settings',
      onClick: () => navigate('settings'),
    },
    {
      icon: <LogOut size={20} />,
      label: 'Cerrar Sesión',
      onClick: onLogout,
      className: 'text-red-500 hover:text-red-600',
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar
        menuItems={menuItems}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <Routes>
            <Route index element={<ProductsOverview onNewScan={() => setIsUploadModalOpen(true)} />} />
            <Route path="table" element={<TableView products={products} />} />
            <Route path="tasks" element={<TasksView />} />
            <Route path="settings" element={<SettingsView />} />
            <Route path="tables" element={<TablesView onViewTable={handleViewTable} />} />
          </Routes>
        </div>
      </main>
      <ExcelUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onDataImport={handleDataImport}
      />
    </div>
  );
}
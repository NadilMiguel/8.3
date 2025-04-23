import React from 'react';
import { 
  Package, 
  DollarSign, 
  TrendingUp, 
  Scale,
  ShoppingCart,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Zap,
  ChevronRight
} from 'lucide-react';
import { StatCard } from './StatCard';
import { Link } from 'react-router-dom';

interface ProductsOverviewProps {
  onNewScan?: () => void;
}

export function ProductsOverview({ onNewScan }: ProductsOverviewProps) {
  // Sample data - replace with real data from your API
  const stats = {
    totalProducts: 1234,
    totalRevenue: 45678.90,
    avgMargin: 32.5,
    avgWeight: 4.2,
    monthlyGrowth: 15.8,
    pendingScans: 23,
  };

  const recentScans = [
    {
      id: 1,
      title: "Walmart Electronics Q1",
      items: 156,
      date: "2025-03-10",
      status: "completed"
    },
    {
      id: 2,
      title: "Amazon Home & Kitchen",
      items: 89,
      date: "2025-03-09",
      status: "processing"
    },
    {
      id: 3,
      title: "Target Seasonal",
      items: 234,
      date: "2025-03-08",
      status: "completed"
    }
  ];

  const topProducts = [
    {
      id: 1,
      name: "Wireless Earbuds Pro",
      profit: 45.99,
      margin: 68.5,
      trend: "up"
    },
    {
      id: 2,
      name: "Smart Home Hub",
      profit: 89.99,
      margin: 52.3,
      trend: "up"
    },
    {
      id: 3,
      name: "Fitness Tracker Elite",
      profit: 34.99,
      margin: 43.7,
      trend: "down"
    }
  ];

  const alerts = [
    {
      id: 1,
      type: "warning",
      message: "3 productos con margen bajo detectados",
      action: "Revisar ahora"
    },
    {
      id: 2,
      type: "info",
      message: "Nuevas oportunidades en categoría Electronics",
      action: "Ver detalles"
    }
  ];

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-none p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-amazon-brown">
            Dashboard
          </h1>
          <button 
            onClick={onNewScan}
            className="px-4 py-2 bg-amazon-orange text-white rounded-lg hover:bg-amazon-orange/90 transition-colors flex items-center gap-2"
          >
            <Zap size={20} />
            Nuevo Escaneo
          </button>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<Package />}
            label="Total Productos"
            value={stats.totalProducts.toLocaleString()}
            trend={+15}
          />
          <StatCard
            icon={<DollarSign />}
            label="Ingresos Totales"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            trend={+8.5}
          />
          <StatCard
            icon={<TrendingUp />}
            label="Margen Promedio"
            value={`${stats.avgMargin}%`}
            trend={-2.3}
          />
          <StatCard
            icon={<Scale />}
            label="Peso Promedio"
            value={`${stats.avgWeight} lbs`}
            trend={+0.5}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide px-8 pb-8">
        {/* Secondary Stats and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Scans */}
          <div className="bg-white rounded-xl shadow-md p-6 col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-amazon-brown">Escaneos Recientes</h2>
              <Link 
                to="/tables" 
                className="text-amazon-orange hover:text-amazon-orange/80 flex items-center gap-1"
              >
                Ver todos
                <ChevronRight size={16} />
              </Link>
            </div>
            <div className="space-y-4">
              {recentScans.map(scan => (
                <div 
                  key={scan.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <h3 className="font-medium text-amazon-brown">{scan.title}</h3>
                    <p className="text-sm text-gray-500">
                      {scan.items} items • {new Date(scan.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span 
                    className={`px-3 py-1 rounded-full text-sm ${
                      scan.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {scan.status === 'completed' ? 'Completado' : 'Procesando'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-amazon-brown mb-4">Alertas</h2>
            <div className="space-y-4">
              {alerts.map(alert => (
                <div 
                  key={alert.id}
                  className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg"
                >
                  <AlertTriangle className="text-amazon-orange flex-shrink-0" size={20} />
                  <div className="flex-1">
                    <p className="text-sm text-amazon-brown">{alert.message}</p>
                    <button className="text-sm text-amazon-orange hover:text-amazon-orange/80 mt-2">
                      {alert.action}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-amazon-brown">Productos Destacados</h2>
            <Link 
              to="/table" 
              className="text-amazon-orange hover:text-amazon-orange/80 flex items-center gap-1"
            >
              Ver todos
              <ChevronRight size={16} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500">
                  <th className="pb-4">Producto</th>
                  <th className="pb-4">Beneficio</th>
                  <th className="pb-4">Margen</th>
                  <th className="pb-4">Tendencia</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {topProducts.map(product => (
                  <tr key={product.id} className="border-t border-gray-100">
                    <td className="py-4">{product.name}</td>
                    <td className="py-4">${product.profit}</td>
                    <td className="py-4">{product.margin}%</td>
                    <td className="py-4">
                      {product.trend === 'up' ? (
                        <ArrowUpRight className="text-green-500" size={20} />
                      ) : (
                        <ArrowDownRight className="text-red-500" size={20} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
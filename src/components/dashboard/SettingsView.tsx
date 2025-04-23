import React, { useState } from 'react';
import { CreditCard, Bell, Shield, User, DollarSign, CheckCircle, XCircle } from 'lucide-react';

interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  features: string[];
  current?: boolean;
}

export function SettingsView() {
  const [activeTab, setActiveTab] = useState<'general' | 'subscription' | 'payments'>('general');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    updates: true,
  });
  const [subscriptionStatus, setSubscriptionStatus] = useState({
    active: true,
    tier: 'pro',
    renewalDate: '2025-03-15',
  });

  const subscriptionTiers: SubscriptionTier[] = [
    {
      id: 'basic',
      name: 'Basic',
      price: 9.99,
      features: [
        'Hasta 100 productos por mes',
        'Análisis básico de productos',
        'Soporte por email',
      ],
    },
    {
      id: 'pro',
      name: 'Professional',
      price: 29.99,
      features: [
        'Productos ilimitados',
        'Análisis avanzado de productos',
        'Soporte prioritario 24/7',
        'Exportación de datos',
        'API access',
      ],
      current: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 99.99,
      features: [
        'Todo lo incluido en Pro',
        'Servidor dedicado',
        'Soporte telefónico',
        'Personalización completa',
        'Múltiples usuarios',
      ],
    },
  ];

  const [paymentMethod, setPaymentMethod] = useState({
    cardNumber: '**** **** **** 4242',
    expiryDate: '12/25',
    cardHolder: 'John Doe',
  });

  const [paymentHistory] = useState([
    {
      id: 1,
      date: '2025-02-15',
      amount: 29.99,
      status: 'completed',
      description: 'Professional Plan - Monthly',
    },
    {
      id: 2,
      date: '2025-01-15',
      amount: 29.99,
      status: 'completed',
      description: 'Professional Plan - Monthly',
    },
  ]);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="flex-none px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              activeTab === 'general'
                ? 'bg-amazon-brown text-white'
                : 'bg-white text-amazon-brown hover:bg-amazon-brown/5'
            }`}
          >
            <User size={20} />
            General
          </button>
          <button
            onClick={() => setActiveTab('subscription')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              activeTab === 'subscription'
                ? 'bg-amazon-brown text-white'
                : 'bg-white text-amazon-brown hover:bg-amazon-brown/5'
            }`}
          >
            <Shield size={20} />
            Suscripción
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              activeTab === 'payments'
                ? 'bg-amazon-brown text-white'
                : 'bg-white text-amazon-brown hover:bg-amazon-brown/5'
            }`}
          >
            <CreditCard size={20} />
            Pagos
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 sm:px-6 lg:px-8 pb-8">
        {activeTab === 'general' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold text-amazon-brown mb-6">Configuración General</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-amazon-brown mb-4">Notificaciones</h3>
                <div className="space-y-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={notifications.email}
                      onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                      className="h-4 w-4 text-amazon-orange focus:ring-amazon-orange border-gray-300 rounded"
                    />
                    <span className="text-gray-700">Notificaciones por email</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={notifications.push}
                      onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
                      className="h-4 w-4 text-amazon-orange focus:ring-amazon-orange border-gray-300 rounded"
                    />
                    <span className="text-gray-700">Notificaciones push</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={notifications.updates}
                      onChange={(e) => setNotifications({ ...notifications, updates: e.target.checked })}
                      className="h-4 w-4 text-amazon-orange focus:ring-amazon-orange border-gray-300 rounded"
                    />
                    <span className="text-gray-700">Actualizaciones del sistema</span>
                  </label>
                </div>
              </div>

              <div className="pt-6">
                <button className="px-4 py-2 bg-amazon-orange text-white rounded-lg hover:bg-amazon-orange/90 transition-colors">
                  Guardar cambios
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'subscription' && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-2xl font-bold text-amazon-brown mb-6">Estado de Suscripción</h2>
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Estado actual</p>
                  <div className="flex items-center mt-1">
                    {subscriptionStatus.active ? (
                      <>
                        <CheckCircle className="text-green-500 w-5 h-5 mr-2" />
                        <span className="text-green-500 font-medium">Activa</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="text-red-500 w-5 h-5 mr-2" />
                        <span className="text-red-500 font-medium">Inactiva</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Plan actual</p>
                  <p className="mt-1 font-medium text-amazon-brown">Plan {subscriptionStatus.tier}</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Próxima renovación</p>
                  <p className="mt-1 font-medium text-amazon-brown">
                    {new Date(subscriptionStatus.renewalDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {subscriptionTiers.map((tier) => (
                <div
                  key={tier.id}
                  className={`bg-white rounded-lg shadow-lg overflow-hidden ${
                    tier.current ? 'ring-2 ring-amazon-orange' : ''
                  }`}
                >
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-amazon-brown">{tier.name}</h3>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-amazon-brown">${tier.price}</span>
                      <span className="text-gray-500">/mes</span>
                    </div>
                    <ul className="mt-6 space-y-4">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-amazon-orange flex-shrink-0" />
                          <span className="ml-3 text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      className={`mt-8 w-full px-4 py-2 rounded-lg ${
                        tier.current
                          ? 'bg-amazon-brown text-white'
                          : 'bg-amazon-orange text-white hover:bg-amazon-orange/90'
                      } transition-colors`}
                    >
                      {tier.current ? 'Plan Actual' : 'Seleccionar Plan'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-2xl font-bold text-amazon-brown mb-6">Método de Pago</h2>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Tarjeta actual</p>
                  <p className="mt-1 font-medium text-amazon-brown">{paymentMethod.cardNumber}</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Fecha de expiración</p>
                  <p className="mt-1 font-medium text-amazon-brown">{paymentMethod.expiryDate}</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Titular</p>
                  <p className="mt-1 font-medium text-amazon-brown">{paymentMethod.cardHolder}</p>
                </div>
                <button className="px-4 py-2 bg-amazon-orange text-white rounded-lg hover:bg-amazon-orange/90 transition-colors">
                  Actualizar
                </button>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-2xl font-bold text-amazon-brown mb-6">Historial de Pagos</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Descripción
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Monto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paymentHistory.map((payment) => (
                      <tr key={payment.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(payment.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${payment.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
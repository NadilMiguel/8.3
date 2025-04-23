import React, { useEffect, useState } from 'react';
import { Database, Calendar, Info, ExternalLink, Trash2, Package, AlertTriangle, Loader2 } from 'lucide-react';
import axios from 'axios';
import { tableService } from '../../services/api';

interface Table {
  _id: string;
  title: string;
  description: string;
  date: string;
  createdAt: string;
  data: any[];
}

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  table: Table | null;
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteConfirmationModal({ isOpen, table, onConfirm, onCancel }: DeleteConfirmationModalProps) {
  if (!isOpen || !table) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onCancel}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full animate-in fade-in duration-200">
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-red-100">
                <AlertTriangle size={24} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-amazon-brown mb-2">
                  ¿Eliminar tabla?
                </h3>
                <p className="text-amazon-brown/80 mb-2">
                  ¿Estás seguro de que deseas eliminar la tabla "{table.title}"?
                </p>
                <p className="text-red-600 text-sm">
                  Esta acción no se puede deshacer y perderás acceso a todos los datos de esta lista escaneada.
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 p-4 flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-lg border border-gray-300 text-amazon-brown hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

interface LoadingModalProps {
  isOpen: boolean;
  tableName: string;
}

function LoadingModal({ isOpen, tableName }: LoadingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={40} className="text-amazon-orange animate-spin" />
          <div className="text-center">
            <h3 className="text-lg font-semibold text-amazon-brown mb-2">
              Cargando tabla
            </h3>
            <p className="text-amazon-brown/70">
              Obteniendo datos de "{tableName}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface TablesViewProps {
  onViewTable?: (data: any[]) => void;
}

export function TablesView({ onViewTable }: TablesViewProps) {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tableToDelete, setTableToDelete] = useState<Table | null>(null);
  const [loadingTable, setLoadingTable] = useState<Table | null>(null);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await tableService.getTables();
        // Sort tables by creation date in descending order (newest first)
        const sortedTables = Array.isArray(response.data) 
          ? response.data.sort((a, b) => {
              const dateA = new Date(a.createdAt || a.date);
              const dateB = new Date(b.createdAt || b.date);
              return dateB.getTime() - dateA.getTime();
            })
          : [];
        setTables(sortedTables);
        setLoading(false);
      } catch (err) {
        let errorMessage = 'Error desconocido al cargar las tablas';
        
        if (axios.isAxiosError(err)) {
          if (err.code === 'ERR_NETWORK') {
            errorMessage = 'Error de conexión: No se puede conectar al servidor de tablas';
          } else if (err.response) {
            errorMessage = `Error del servidor: ${err.response.status}`;
          } else if (err.request) {
            errorMessage = 'No se recibió respuesta del servidor';
          } else {
            errorMessage = 'Error al realizar la petición';
          }
        }
        
        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchTables();
  }, []);

  const handleViewTable = async (table: Table) => {
    try {
      setLoadingTable(table);
      const data = await tableService.getDataTable(table._id);
      if (onViewTable && data) {
        onViewTable(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error al cargar los datos de la tabla:', error);
      alert('Error al cargar los datos de la tabla. Por favor, intente nuevamente.');
    } finally {
      setLoadingTable(null);
    }
  };

  const handleDeleteTable = async (table: Table) => {
    setTableToDelete(table);
  };

  const confirmDelete = async () => {
    if (!tableToDelete) return;

    try {
      await tableService.deleteTable(tableToDelete._id);
      setTables(prevTables => prevTables.filter(table => table._id !== tableToDelete._id));
      setTableToDelete(null);
    } catch (err) {
      console.error('Error al eliminar la tabla:', err);
      alert('Error al eliminar la tabla. Por favor, intente nuevamente.');
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Fecha no disponible';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl text-amazon-orange">
          Cargando tablas...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="text-xl mb-4 text-center text-red-500">
          {error}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-lg bg-walmart-blue text-white hover:bg-walmart-blueLight"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="p-8 bg-white border-b border-amazon-orange/20">
        <h1 className="text-2xl font-bold flex items-center gap-3 text-amazon-brown">
          <Database size={28} />
          Tablas Guardadas
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-4">
        {tables.length === 0 ? (
          <div className="bg-white border border-amazon-orange/30 rounded-xl p-6 text-amazon-brown text-center">
            <p>No hay tablas guardadas. Sube un archivo Excel para crear una nueva tabla.</p>
          </div>
        ) : (
          tables.map((table) => (
            <div
              key={table._id}
              className="w-full rounded-xl p-6 transition-all duration-200 bg-white border border-amazon-orange/20 hover:border-amazon-orange cursor-pointer shadow-sm hover:shadow-md"
              onClick={() => handleViewTable(table)}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-semibold text-lg text-amazon-brown">
                  {table.title || 'Sin título'}
                </h3>
                <div className="flex gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewTable(table);
                    }}
                    className="p-1.5 rounded-full hover:bg-walmart-blue/10 text-walmart-blue"
                    title="Ver detalles"
                  >
                    <ExternalLink size={18} />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTable(table);
                    }}
                    className="p-1.5 rounded-full hover:bg-red-50 text-red-500"
                    title="Eliminar tabla"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {table.description && (
                <div className="flex items-start gap-2 mb-4">
                  <Info size={16} className="text-walmart-blue mt-0.5" />
                  <p className="text-sm text-amazon-brown/80">
                    {table.description}
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm text-amazon-brown/60">
                  <Calendar size={16} />
                  <span>
                    {formatDate(table.date || table.createdAt)}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-amazon-brown/60">
                  <Package size={16} />
                  <span>
                    Cantidad de productos: {Array.isArray(table.data) ? table.data.length : 0}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <DeleteConfirmationModal
        isOpen={tableToDelete !== null}
        table={tableToDelete}
        onConfirm={confirmDelete}
        onCancel={() => setTableToDelete(null)}
      />

      <LoadingModal
        isOpen={loadingTable !== null}
        tableName={loadingTable?.title || ''}
      />
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import { ClipboardList, Calendar, CheckCircle2, XCircle, Plus, X, ExternalLink } from 'lucide-react';
import { taskService } from '../../services/api';

interface Task {
  _id: number;
  title: string;
  description: string;
  completed: boolean;
  created: string;
}

interface TaskDetailsModalProps {
  task: Task | null;
  onClose: () => void;
}

function TaskDetailsModal({ task, onClose }: TaskDetailsModalProps) {
  if (!task) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full animate-in fade-in duration-200">
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <h3 className="text-xl font-semibold text-amazon-brown">
                {task.title}
              </h3>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-amazon-brown/70 mb-2">
                  Descripción
                </h4>
                <p className="text-amazon-brown whitespace-pre-wrap">
                  {task.description}
                </p>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-amazon-brown/60 pt-4 border-t border-gray-100">
                <Calendar size={16} />
                <span>
                  {new Date(task.created).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function TasksView() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getTasks();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las tareas. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async () => {
    if (!newTask.title.trim()) {
      alert('El título de la tarea es obligatorio');
      return;
    }

    try {
      const createdTask = await taskService.createTask({
        title: newTask.title,
        description: newTask.description,
        completed: false
      });
      
      setTasks([...tasks, createdTask]);
      setNewTask({ title: '', description: '' });
      setIsAddingTask(false);
    } catch (error) {
      console.error('Error al crear tarea:', error);
      alert('Error al crear la tarea. Por favor, intenta de nuevo.');
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      await taskService.deleteTask(task._id);
      fetchTasks();
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
      alert('Error al actualizar la tarea. Por favor, intenta de nuevo.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl text-amazon-orange">
          Cargando tareas...
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
          onClick={fetchTasks}
          className="px-4 py-2 rounded-lg bg-amazon-brown text-white hover:bg-amazon-brownLight transition-colors duration-200"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="flex-none p-8 border-b border-amazon-orange/20">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-3 text-amazon-brown">
            <ClipboardList size={28} />
            Tareas
          </h1>
          <button
            onClick={() => setIsAddingTask(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amazon-brown text-white hover:bg-amazon-brownLight transition-colors duration-200"
          >
            <Plus size={20} />
            Nueva Tarea
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {isAddingTask && (
          <div className="mb-8 p-6 rounded-xl bg-white border border-amazon-orange/20 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-amazon-brown">Agregar Nueva Tarea</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-amazon-brown mb-1">
                  Título
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full rounded-lg px-3 py-2 bg-white border border-amazon-orange/30 text-amazon-brown placeholder-amazon-brown/50 focus:outline-none focus:ring-2 focus:ring-amazon-orange focus:border-transparent"
                  placeholder="Título de la tarea"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-amazon-brown mb-1">
                  Descripción
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  className="w-full rounded-lg px-3 py-2 bg-white border border-amazon-orange/30 text-amazon-brown placeholder-amazon-brown/50 focus:outline-none focus:ring-2 focus:ring-amazon-orange focus:border-transparent"
                  placeholder="Descripción de la tarea"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsAddingTask(false)}
                  className="px-4 py-2 rounded-lg border border-amazon-orange text-amazon-orange hover:bg-amazon-orange/10 transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddTask}
                  className="px-4 py-2 rounded-lg bg-amazon-brown text-white hover:bg-amazon-brownLight transition-colors duration-200"
                >
                  Guardar Tarea
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.length === 0 ? (
            <div className="col-span-full text-center py-12 text-amazon-brown/70">
              No hay tareas disponibles. ¡Crea una nueva tarea!
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task._id}
                className="rounded-xl p-6 transition-all duration-200 bg-white border border-amazon-orange/20 hover:border-amazon-orange/40 shadow-md hover:shadow-lg"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-semibold text-lg text-amazon-brown line-clamp-1">
                    {task.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedTask(task)}
                      className="p-1 rounded-full hover:bg-amazon-orange/10 text-amazon-orange transition-colors"
                      title="Ver detalles"
                    >
                      <ExternalLink size={18} />
                    </button>
                    <button 
                      onClick={() => handleToggleComplete(task)}
                      className="transition-transform hover:scale-110"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="text-amazon-orange" size={20} />
                      ) : (
                        <XCircle className="text-red-500" size={20} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-amazon-brown/80 line-clamp-3">
                    {task.description}
                  </p>
                  {task.description.length > 150 && (
                    <button
                      onClick={() => setSelectedTask(task)}
                      className="text-sm text-amazon-orange hover:text-amazon-orange/80 mt-2"
                    >
                      Ver más
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm text-amazon-brown/60">
                  <Calendar size={16} />
                  <span>
                    {new Date(task.created).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <TaskDetailsModal
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
      />
    </div>
  );
}
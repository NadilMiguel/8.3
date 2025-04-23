import axios from 'axios';

// Configuración base de Axios
const api = axios.create({
  baseURL: 'https://scanlist.pro', // Cambia esto según la URL de tu backend
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para manejar tokens de autenticación
api.interceptors.request.use(
   (config) => { 
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Servicios de autenticación
export const authService = {
  login: async (email: string, password: string) => {
    try {
        const response = await api.post('/api/login', { email, password });
        console.log("Respuesta del servidor:", response.data); // 🔍 Verifica la respuesta

        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            console.log("Token guardado en localStorage:", response.data.token); // 🔥 Verifica que se guarda
        }

        return response.data;
    } catch (error) {
        console.error('Error en login:', error);
        throw error;
    }
  },

  
  register: async (username: string, email: string, password: string) => {
    try {
      const response = await api.post('/api/register', { username, email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  },
  
  logout: async () => {
    try {
      await api.post('/api/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Error en logout:', error);
      // Incluso si hay error, eliminamos los datos locales
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error;
    }
  },
  
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

// Servicio para productos
export const tableService = {
 
  getTables: async () => {
    try {
      const response = await api.get('/api/table');
      console.log(response.data)
      return response;
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw error;
    }
  }, 
  
  getDataTable: async (id: string) => {
    try {
      const response = await api.get(`/api/table/${id}/data`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener datos de la tabla:', error);
      throw error;
    }
  },
  

  uploadProductList: async (products: any[]) => {
    try {
      const response = await api.post('/api/table', { products });
      return response;
    } catch (error) {
      console.error('Error al subir lista de productos:', error);
      throw error;
    }
  },
  
  getProductDetails: async (upc: string) => {
    try {
      const response = await api.get(`/products/${upc}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener detalles del producto ${upc}:`, error);
      throw error;
    }
  },

  deleteTable: async (id: number) => {
    try {
      await api.delete(`api/table/${id}`);
      return true;
    } catch (error) {
      console.error(`Error al eliminar table ${id}:`, error);
      throw error;
    
  }
}

};

// Servicio para tareas
export const taskService = {
  getTasks: async () => {
    try {
      const response = await api.get('/api/tasks');
      return response.data;
    } catch (error) {
      console.error('Error al obtener tareas:', error);
      throw error;
    }
  },
  
  createTask: async (taskData: any) => {
    try {
      const response = await api.post('/api/tasks', taskData);
      return response.data;
    } catch (error) {
      console.error('Error al crear tarea:', error);
      throw error;
    }
  },
  
  updateTask: async (id: number, taskData: any) => {
    try {
      const response = await api.put(`api/tasks/${id}`, taskData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar tarea ${id}:`, error);
      throw error;
    }
  },
  
  deleteTask: async (id: number) => {
    try {
      await api.delete(`api/tasks/${id}`);
      return true;
    } catch (error) {
      console.error(`Error al eliminar tarea ${id}:`, error);
      throw error;
    }
  }
};

export async function  createTable(finalData : any){
  
      // Enviar los datos a la API
      // Configuración base de Axios
    try{
      const api = axios.create({
        baseURL: 'https://scanlist.pro', // Cambia esto según la URL de tu backend
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      // Interceptor para manejar tokens de autenticación
      api.interceptors.request.use(
        (config) => {
          const token = localStorage.getItem('token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        return config;
      },
      (error) => Promise.reject(error)
      );
      const response = await api.post('/api/table', finalData )
      return response
    }
    catch(error){
      console.error(error)
    }
 
    
}

export default api;
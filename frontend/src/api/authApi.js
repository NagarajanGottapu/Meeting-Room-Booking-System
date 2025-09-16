import api from './config';

export const authApi = {
  login: async (name, email) => {
    const response = await api.post('/auth/login', { name, email });
    return response.data;
  },
  
  /*getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  }*/
};
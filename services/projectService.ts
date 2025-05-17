import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export interface Project {
  id: number;
  title: string;
  description: string;
  content: any;
  created_at: string;
  updated_at: string;
}

const projectService = {
  getProjects: async (title: string = '', page: number = 1) => {
    const res = await axios.get(`${API_URL}/projects`, {
      params: { title, page }
    });
    return res.data;
  },

  deleteProject: async (id: number) => {
    await axios.delete(`${API_URL}/projects/${id}`);
  }
};

export default projectService;
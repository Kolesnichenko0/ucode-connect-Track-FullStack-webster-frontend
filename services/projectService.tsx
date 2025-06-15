import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export interface Project {
  id: number;
  title: string;
  description: string;
  backgroundColor: string;
  showGrid: boolean;
  gridColor: string;
  height: number;
  width: number;
  isTemplate: boolean;
  isTransparent: boolean;
  type: string;
  content: any;
  created_at: string;
  updated_at: string;
}

const projectService = {
  getProjects: async (id: number, title: string = '', cursor: { updatedAt: string; id: number } | null = null) => {
    const params: any = {};
    if (title !== '') params.title = title;
    if (cursor) {
      params['after[updatedAt]'] = cursor.updatedAt;
      params['after[id]'] = cursor.id;
    }
    params.isTemplate = false;
    const res = await axios.get(`${API_URL}/users/${id}/projects`, {
      params,
      withCredentials: true,
    });
    return res.data;
  },

  getRecentProjects: async (id: number, title: string = '') => {
    const res = await axios.get(`${API_URL}/users/${id}/projects`, {
      params: { ...(title !== '' && { title }), limit: 5},
      withCredentials: true,
    });
    return res.data;
  },

  getTemplates: async () => {
    const res = await axios.get(`${API_URL}/projects/templates`);
    return res.data;
  },

  getProject: async (id: number) => {
    try {
      const res = await axios.get(`${API_URL}/projects/${id}`, {withCredentials: true});
      return res.data;
    } catch (error) {
      console.error(`Error fetching project with id ${id}:`, error);
      throw error;
    }
  },

  /*getThumbnail: async (id: number, key: number) => {
    try {
      const res = await axios.get(`${API_URL}/files/${id}`);
      const fileKey = res.data.files.filter((o) => o.id === key).fileKey;
      const resp = await projectService.getFileByFileKey(fileKey);
      return resp.data;
    } catch (error) {
      console.error(`Error fetching file :`, error);
      throw error;
    }
  },*/

  getFileByFileKey: async (key: number) => {
    try {
      const res = await axios.get(`${API_URL}/files/${key}`, {
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      console.error(`Error fetching file :`, error);
      throw error;
    }
  },

  editProject: async (id: number, data: Partial<Project>) => {
    try {
      const res = await axios.patch(`${API_URL}/projects/${id}`, data);
      return res.data;
    } catch (error) {
      console.error(`Error editing project with id ${id}:`, error);
      throw error;
    }
  },

  createProject:  async (data: Partial<Project>) => {
    try {
      const res = await axios.post(`${API_URL}/projects`, data);
      return res.data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },

  createProjectCopy: async (id: number) => {
    try {
      const res = await axios.post(`${API_URL}/projects/${id}/copy`);
      return res.data;
    } catch (error) {
      console.error('Error creating project copy:', error);
      throw error;
    }
  },

  deleteProject: async (id: number) => {
    try {
      const res = await axios.delete(`${API_URL}/projects/${id}`);
      return res.data;
    } catch (error) {
      console.error(`Error deleting project with id ${id}:`, error);
      throw error;
    }
  }
};

export default projectService;
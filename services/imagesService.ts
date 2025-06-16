import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const imagesService = {
    getProjectBackgrounds: async () => {
      try {
        const res = await axios.get(`${API_URL}/files/default/project-backgrounds`);
        return res.data;
      } catch (error) {
        console.error(`Error fetching project backgrounds:`, error);
        throw error;
      }
    },

    getProjectElements: async () => {
        try {
          const res = await axios.get(`${API_URL}/files/default/project-elements`);
          return res.data;
        } catch (error) {
          console.error(`Error fetching project elements:`, error);
          throw error;
        }
    },

    getProjectAssets: async () => {
        try {
          const res = await axios.get(`${API_URL}/files/default/project-assets`);
          return res.data;
        } catch (error) {
          console.error(`Error fetching project assets:`, error);
          throw error;
        }
    },

    getAllProjectFiles: async (id: number) => {
        try {
          const res = await axios.get(`${API_URL}/projects/${id}/files`);
          return res.data.files;
        } catch (error) {
          console.error(`Error fetching project files:`, error);
          throw error;
        }
    },

    addFileToProject: async (id: number, file: File) => {
        const formData = new FormData();
        formData.append('files', file);

        try {
            const res = await axios.post(`${API_URL}/projects/${id}/files`, formData);
            return res.data.files;
        } catch (error) {
            console.error(`Error adding file:`, error);
            throw error;
        }
    },

    removeFileFromProject: async (id: number, fileKey: number) => {
      try {
        const res = await axios.delete(`${API_URL}/projects/${id}/files/${fileKey}`);
        return res.data;
      } catch (error) {
        console.error(`Error fetching project files:`, error);
        throw error;
      }
    },

    getBlobPreviewUrl: async (url: string) => {
        try {
          const res = await axios.get(url, { responseType: 'blob' });
          return URL.createObjectURL(res.data);
        } catch (err) {
          console.error('Failed to fetch preview blob:', err);
          return '';
        }
    },

    getUnsplashPhotos: async (title: string = '') => {
      const params: any = {};
      if (title !== '') params.query = title;

      const res = await axios.get(`${API_URL}/photos/unsplash/search`, {
        params,
      });
      return res.data.results;
    },

    generateImage: async (prompt: string = '') => {
      const body = prompt ? { prompt } : {};

      const res = await axios.post(`${API_URL}/photos/pollinations/generate`, body, {
        responseType: 'blob', 
      });
      return res.data;
    }

  };
  
  export default imagesService;
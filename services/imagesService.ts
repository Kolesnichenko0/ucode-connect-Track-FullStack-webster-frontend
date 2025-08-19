import axios from 'axios';
import {getApiUrl} from "../utils/urls";

const imagesService = {
    getProjectBackgrounds: async () => {
      try {
        const res = await axios.get(`${getApiUrl()}/files/default/project-backgrounds`);
        return res.data;
      } catch (error) {
        console.error(`Error fetching project backgrounds:`, error);
        throw error;
      }
    },

    getProjectElements: async () => {
        try {
          const res = await axios.get(`${getApiUrl()}/files/default/project-elements`);
          return res.data;
        } catch (error) {
          console.error(`Error fetching project elements:`, error);
          throw error;
        }
    },

    getProjectAssets: async () => {
        try {
          const res = await axios.get(`${getApiUrl()}/files/default/project-assets`);
          return res.data;
        } catch (error) {
          console.error(`Error fetching project assets:`, error);
          throw error;
        }
    },

    getAllProjectFiles: async (id: number) => {
        try {
          const res = await axios.get(`${getApiUrl()}/projects/${id}/files`);
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
            const res = await axios.post(`${getApiUrl()}/projects/${id}/files`, formData);
            return res.data.files;
        } catch (error) {
            console.error(`Error adding file:`, error);
            throw error;
        }
    },

    removeFileFromProject: async (id: number, fileKey: number) => {
      try {
        const res = await axios.delete(`${getApiUrl()}/projects/${id}/files/${fileKey}`);
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

      const res = await axios.get(`${getApiUrl()}/photos/unsplash/search`, {
        params,
      });
      return res.data.results;
    },

    generateImage: async (prompt: string = '') => {
      const body = prompt ? { prompt } : {};

      const res = await axios.post(`${getApiUrl()}/photos/pollinations/generate`, body, {
        responseType: 'blob', 
      });
      return res.data;
    }

  };
  
  export default imagesService;
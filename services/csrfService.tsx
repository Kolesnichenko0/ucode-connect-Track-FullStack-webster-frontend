import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

class CsrfService {
    private csrfToken: string | null = null;
    
    async fetchCsrfToken(): Promise<string | null> {
        try {
            const response = await axios.get(`${API_URL}/csrf-token`, {
            });
            this.csrfToken = response.data.csrfToken;
            return this.csrfToken;
        } catch (error) {
            console.error('Error getting CSRF token:', error);
            return null;
        } 
    }
    
    getCsrfToken(): string | null {
        return this.csrfToken;
    }
    

    setupAxiosInterceptors(): void {
        axios.interceptors.request.use(config => {

            if (
                this.csrfToken &&
                ['POST', 'PUT', 'PATCH', 'DELETE'].includes(config.method?.toUpperCase() || '')
            ) {
                config.withCredentials = true;
                config.headers['X-CSRF-Token'] = this.csrfToken;
            }
            return config;
        });
    }
}

export default new CsrfService();



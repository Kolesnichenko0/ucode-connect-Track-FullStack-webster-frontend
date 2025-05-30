import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

class CsrfService {
    private csrfToken: string | null = null;
    private interceptorsSetup: boolean = false;
    
    async fetchCsrfToken(): Promise<string | null> {
        try {
            const response = await axios.get(`${API_URL}/csrf-token`, {
                withCredentials: true
            });
            this.csrfToken = response.data.csrfToken;
            console.log('CSRF token fetched:', this.csrfToken); // для отладки
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
        if (this.interceptorsSetup) {
            console.log('CSRF interceptors already setup');
            return;
        }
        
        axios.interceptors.request.use(config => {
            console.log('CSRF interceptor triggered for:', config.method, config.url);
            
            if (
                this.csrfToken &&
                ['POST', 'PUT', 'PATCH', 'DELETE'].includes(config.method?.toUpperCase() || '')
            ) {
                config.withCredentials = true;
                config.headers['X-CSRF-Token'] = this.csrfToken;
                console.log('Added CSRF token to headers:', this.csrfToken);
            }
            return config;
        });
        
        this.interceptorsSetup = true;
        console.log('CSRF interceptors setup completed');
    }
}

export default new CsrfService();



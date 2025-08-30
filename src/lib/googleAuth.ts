// Google OAuth Configuration and Utilities
export interface GoogleUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  picture?: string;
}

export interface GoogleAuthResponse {
  access_token: string;
  id_token: string;
  scope: string;
  token_type: string;
  expiry_date: number;
}

class GoogleAuthService {
  private clientId: string;
  private redirectUri: string;

  constructor() {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      throw new Error('NEXT_PUBLIC_GOOGLE_CLIENT_ID environment variable must be set');
    }
    this.clientId = clientId;
    this.redirectUri = typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : '';
  }

  // Initialize Google OAuth
  initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Google OAuth can only be initialized in the browser'));
        return;
      }

      if (!this.clientId) {
        reject(new Error('Google Client ID is not configured'));
        return;
      }

      // Check if script is already loaded
      if (window.google?.accounts?.id) {
        this.initializeGoogleOAuth();
        resolve();
        return;
      }

      // Load Google OAuth script
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        // Wait a bit for Google to be fully available
        setTimeout(() => {
          if (window.google?.accounts?.id) {
            this.initializeGoogleOAuth();
            resolve();
          } else {
            reject(new Error('Google OAuth not available after script load'));
          }
        }, 100);
      };

      script.onerror = () => {
        reject(new Error('Failed to load Google OAuth script'));
      };

      document.head.appendChild(script);
    });
  }

  // Initialize Google OAuth after script is loaded
  private initializeGoogleOAuth(): void {
    try {
      window.google.accounts.id.initialize({
        client_id: this.clientId,
        callback: this.handleCredentialResponse.bind(this),
        auto_select: false,
        cancel_on_tap_outside: true,
      });
    } catch (error) {
      console.error('Error initializing Google OAuth:', error);
      throw error;
    }
  }

  // Handle Google OAuth response
  private async handleCredentialResponse(response: { credential: string }): Promise<void> {
    try {
      const credential = response.credential;
      const payload = this.decodeJwt(credential);
      
      const googleUser: GoogleUser = {
        id: payload.sub,
        email: payload.email,
        firstName: payload.given_name,
        lastName: payload.family_name,
        picture: payload.picture,
      };

      // Store user data temporarily
      sessionStorage.setItem('googleUser', JSON.stringify(googleUser));
      sessionStorage.setItem('googleCredential', credential);

      // Redirect to callback or handle directly
      window.location.href = '/auth/callback';
    } catch (error) {
      console.error('Error handling Google OAuth response:', error);
      throw error;
    }
  }

  // Decode JWT token
  private decodeJwt(token: string): { sub: string; email: string; given_name: string; family_name: string; picture?: string } {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding JWT:', error);
      throw new Error('Invalid token format');
    }
  }

  // Trigger Google OAuth login
  async login(): Promise<void> {
    if (typeof window === 'undefined') {
      throw new Error('Google OAuth can only be used in the browser');
    }

    console.log('Google OAuth login initiated');
    console.log('Client ID:', this.clientId);
    console.log('Redirect URI:', this.redirectUri);

    if (!window.google?.accounts?.id) {
      console.log('Google OAuth not initialized, initializing now...');
      await this.initialize();
    }

    try {
      console.log('Triggering Google OAuth prompt...');
      window.google.accounts.id.prompt();
    } catch (error) {
      console.error('Error triggering Google OAuth:', error);
      throw error;
    }
  }

  // Get stored Google user data
  getStoredUser(): GoogleUser | null {
    if (typeof window === 'undefined') return null;
    
    const userData = sessionStorage.getItem('googleUser');
    return userData ? JSON.parse(userData) : null;
  }

  // Get stored Google credential
  getStoredCredential(): string | null {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem('googleCredential');
  }

  // Clear stored Google data
  clearStoredData(): void {
    if (typeof window === 'undefined') return;
    
    sessionStorage.removeItem('googleUser');
    sessionStorage.removeItem('googleCredential');
  }

  // Check if Google OAuth is available
  isAvailable(): boolean {
    return typeof window !== 'undefined' && !!window.google?.accounts?.id;
  }

  // Render Google Sign-In button
  renderButton(elementId: string): void {
    if (typeof window === 'undefined' || !window.google?.accounts?.id) {
      console.error('Google OAuth not available for button rendering');
      return;
    }

    try {
      window.google.accounts.id.renderButton(
        document.getElementById(elementId),
        {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          shape: 'rectangular',
          logo_alignment: 'left',
        }
      );
    } catch (error) {
      console.error('Error rendering Google Sign-In button:', error);
    }
  }
}

// Create and export singleton instance
export const googleAuthService = new GoogleAuthService();

// Add Google types to window object
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (response: { credential: string }) => void; auto_select?: boolean; cancel_on_tap_outside?: boolean }) => void;
          prompt: () => void;
          renderButton: (element: HTMLElement | null, options: {
            type?: 'standard' | 'icon';
            theme?: 'outline' | 'filled_blue' | 'filled_black';
            size?: 'large' | 'medium' | 'small';
            text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
            shape?: 'rectangular' | 'rounded' | 'pill' | 'circle' | 'square';
            logo_alignment?: 'left' | 'center';
          }) => void;
        };
      };
    };
  }
}

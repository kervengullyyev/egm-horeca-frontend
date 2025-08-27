export interface SignUpData {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	password: string;
}

export interface SignInData {
	email: string;
	password: string;
}

export interface SSOData {
	provider: 'google' | 'apple';
	token: string;
	email: string;
	firstName?: string;
	lastName?: string;
}

export interface AuthResponse {
	success: boolean;
	message: string;
	token?: string;
	user?: {
		id: string;
		firstName: string;
		lastName: string;
		email: string;
		phone: string;
	};
}

class AuthService {
	private baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

	async signUp(data: SignUpData): Promise<AuthResponse> {
		try {
			const response = await fetch(`${this.baseUrl}/api/v1/auth/signup`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.detail || 'Sign up failed');
			}

			// Store token in localStorage
			if (result.token) {
				localStorage.setItem('authToken', result.token);
				localStorage.setItem('user', JSON.stringify(result.user));
			}

			return result;
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : 'Sign up failed. Please try again.';
			throw new Error(errorMessage);
		}
	}

	async signIn(data: SignInData): Promise<AuthResponse> {
		try {
			const response = await fetch(`${this.baseUrl}/api/v1/auth/signin`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.detail || 'Sign in failed');
			}

			// Store token in localStorage
			if (result.token) {
				localStorage.setItem('authToken', result.token);
				localStorage.setItem('user', JSON.stringify(result.user));
			}

			return result;
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : 'Sign in failed. Please try again.';
			throw new Error(errorMessage);
		}
	}

	async ssoLogin(data: SSOData): Promise<AuthResponse> {
		try {
			const response = await fetch(`${this.baseUrl}/api/v1/auth/sso`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.detail || 'SSO login failed');
			}

			// Store token in localStorage
			if (result.token) {
				localStorage.setItem('authToken', result.token);
				localStorage.setItem('user', JSON.stringify(result.user));
			}

			return result;
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : 'SSO login failed. Please try again.';
			throw new Error(errorMessage);
		}
	}

	async signOut(): Promise<void> {
		try {
			const token = localStorage.getItem('authToken');
			if (token) {
				await fetch(`${this.baseUrl}/api/v1/auth/signout`, {
					method: 'POST',
					headers: {
						'Authorization': `Bearer ${token}`,
					},
				});
			}
		} catch (error) {
			console.error('Sign out error:', error);
		} finally {
			localStorage.removeItem('authToken');
			localStorage.removeItem('user');
		}
	}

	isAuthenticated(): boolean {
		return !!localStorage.getItem('authToken');
	}

	getToken(): string | null {
		return localStorage.getItem('authToken');
	}

	getUser(): { firstName?: string; lastName?: string; email?: string; phone?: string } | null {
		const user = localStorage.getItem('user');
		return user ? JSON.parse(user) : null;
	}
}

export const authService = new AuthService();

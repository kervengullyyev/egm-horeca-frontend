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

export interface ForgotPasswordData {
	email: string;
}

export interface ResetPasswordData {
	token: string;
	new_password: string;
}

export interface PasswordResetResponse {
	success: boolean;
	message: string;
}

class AuthService {
	private baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
	
	constructor() {
		if (!this.baseUrl) {
			throw new Error('NEXT_PUBLIC_API_BASE_URL environment variable must be set');
		}
	}

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
				if (typeof window !== 'undefined') {
					localStorage.setItem('authToken', result.token);
					localStorage.setItem('user', JSON.stringify(result.user));
				}
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
				if (typeof window !== 'undefined') {
					localStorage.setItem('authToken', result.token);
					localStorage.setItem('user', JSON.stringify(result.user));
				}
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
				if (typeof window !== 'undefined') {
					localStorage.setItem('authToken', result.token);
					localStorage.setItem('user', JSON.stringify(result.user));
				}
			}

			return result;
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : 'SSO login failed. Please try again.';
			throw new Error(errorMessage);
		}
	}

	async signOut(): Promise<void> {
		try {
			const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
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
			if (typeof window !== 'undefined') {
				localStorage.removeItem('authToken');
				localStorage.removeItem('user');
			}
		}
	}

	isAuthenticated(): boolean {
		return typeof window !== 'undefined' ? !!localStorage.getItem('authToken') : false;
	}

	getToken(): string | null {
		return typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
	}

	getUser(): { firstName?: string; lastName?: string; email?: string; phone?: string } | null {
		if (typeof window !== 'undefined') {
			const user = localStorage.getItem('user');
			return user ? JSON.parse(user) : null;
		}
		return null;
	}

	async forgotPassword(data: ForgotPasswordData): Promise<PasswordResetResponse> {
		try {
			const response = await fetch(`${this.baseUrl}/api/v1/auth/forgot-password`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			const result = await response.json();

			if (!response.ok) {
				// Handle validation errors (422)
				if (response.status === 422 && result.detail) {
					if (Array.isArray(result.detail)) {
						const validationError = result.detail[0];
						if (validationError.type === 'missing') {
							if (validationError.loc?.includes('email')) {
								throw new Error('Email is required');
							}
						} else if (validationError.type === 'string_pattern_mismatch' && validationError.loc?.includes('email')) {
							throw new Error('Please enter a valid email address');
						}
						// Handle other validation errors
						if (validationError.msg) {
							throw new Error(validationError.msg);
						}
					}
					// Handle non-array detail
					if (typeof result.detail === 'string') {
						throw new Error(result.detail);
					}
				}
				// Handle other error types
				if (typeof result.detail === 'string') {
					throw new Error(result.detail);
				}
				throw new Error('Failed to send reset email');
			}

			return result;
		} catch (error: unknown) {
			console.error('Forgot password error:', error);
			const errorMessage = error instanceof Error ? error.message : 'Failed to send reset email. Please try again.';
			throw new Error(errorMessage);
		}
	}

	async resetPassword(data: ResetPasswordData): Promise<PasswordResetResponse> {
		try {
			const response = await fetch(`${this.baseUrl}/api/v1/auth/reset-password`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			const result = await response.json();

			if (!response.ok) {
				// Handle validation errors (422)
				if (response.status === 422 && result.detail) {
					if (Array.isArray(result.detail)) {
						const validationError = result.detail[0];
						if (validationError.type === 'missing') {
							if (validationError.loc?.includes('new_password')) {
								throw new Error('Password is required');
							} else if (validationError.loc?.includes('token')) {
								throw new Error('Reset token is required');
							} else if (validationError.loc?.includes('email')) {
								throw new Error('Email is required');
							}
						} else if (validationError.type === 'string_too_short') {
							if (validationError.loc?.includes('new_password')) {
								throw new Error('Password must be at least 6 characters long');
							} else if (validationError.loc?.includes('token')) {
								throw new Error('Invalid reset link. Please request a new password reset.');
							}
						} else if (validationError.type === 'string_pattern_mismatch' && validationError.loc?.includes('email')) {
							throw new Error('Please enter a valid email address');
						}
						// Handle other validation errors
						if (validationError.msg) {
							throw new Error(validationError.msg);
						}
					}
					// Handle non-array detail
					if (typeof result.detail === 'string') {
						throw new Error(result.detail);
					}
				}
				// Handle other error types
				if (typeof result.detail === 'string') {
					throw new Error(result.detail);
				}
				throw new Error('Failed to reset password');
			}

			return result;
		} catch (error: unknown) {
			console.error('Reset password error:', error);
			const errorMessage = error instanceof Error ? error.message : 'Failed to reset password. Please try again.';
			throw new Error(errorMessage);
		}
	}
}

export const authService = new AuthService();

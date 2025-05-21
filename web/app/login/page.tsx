'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { loginUser } from '@/features/auth/login/loginService';
import { useAuth } from '../providers';
import { useSubdomain, CurrentTenantInfo } from '../subdomain-login-helper';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, user } = useAuth();
  const { subdomain, isSubdomainLoaded } = useSubdomain();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Check if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Redirect tenant managers and super admins to admin dashboard
      if ((user?.role === 'TENANT_MANAGER' || user?.role === 'SUPER_ADMIN') && !subdomain) {
        router.push('/admin');
      } else {
        // Other users go to normal dashboard
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, router, user, subdomain]);

  // Handle navigation after successful login
  useEffect(() => {
    if (loginSuccess) {
      console.log('Login successful, redirecting...');
      setTimeout(() => {
        // Let the authentication check in the above useEffect handle redirection
        router.refresh(); // Force refresh to update navigation state
      }, 500); // Short delay to ensure token is saved
    }
  }, [loginSuccess, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setDebugInfo(null);
    setLoading(true);
    setLoginSuccess(false);

    const formData = new FormData(e.currentTarget);
    const usernameOrEmail = formData.get('usernameOrEmail') as string;
    const password = formData.get('password') as string;

    try {
      // Show API URL for debugging
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

      // Log appropriate message based on subdomain
      const loginContext = subdomain
        ? `tenant '${subdomain}'`
        : 'Tenant Manager';

      setDebugInfo(`Connecting to backend at: ${apiUrl}/api/v1/auth/login as ${loginContext}`);

      // In a production environment, the subdomain would be passed via Host header
      // For local development, we need to pass it explicitly in the loginUser function
      // Only pass the subdomain if it's not null
      const loginCredentials = {
        usernameOrEmail,
        password,
        ...(subdomain ? { subdomain } : {})
      };

      const response = await loginUser(loginCredentials);

      // Show success message
      console.log('Login successful, received token:', response.token.substring(0, 15) + '...');
      console.log('User role:', response.user.role);

      const isManagerRole = response.user.role === 'TENANT_MANAGER' || response.user.role === 'SUPER_ADMIN';

      // Check if user is trying to login to tenant subdomain as a tenant manager
      if (subdomain && isManagerRole) {
        setDebugInfo(`Note: You're logging in with Tenant Manager privileges on a tenant subdomain.`);
      }

      // Check if user is trying to login as tenant user on the main domain
      if (!subdomain && !isManagerRole) {
        setDebugInfo(`Note: You're logging in with tenant user privileges on the main domain.`);
      }

      // Use the auth context to login
      login(response.token, response.user);

      // Set success state to trigger the navigation effect
      setLoginSuccess(true);
      const destination = (!subdomain && isManagerRole) ? 'admin dashboard' : 'dashboard';
      setDebugInfo(`Login successful! Redirecting to ${destination}...`);
    } catch (err: any) {
      console.error('Login error caught in page:', err);
      setError(err.message || 'Invalid username/email or password');

      // Add more debug info for developer
      if (process.env.NEXT_PUBLIC_DEVELOPMENT_MODE === 'true') {
        setDebugInfo(`
          Error Details:
          - Message: ${err.message}
          - Check browser console for full error logs
          - Ensure Spring Boot server is running at ${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login
          - Check CORS configuration on backend
        `);
      }
    } finally {
      setLoading(false);
    }
  };

  // Wait for subdomain information to load
  if (!isSubdomainLoaded) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">
            {subdomain
              ? `Log in to ${subdomain} tenant`
              : 'Log in as Tenant Manager'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CurrentTenantInfo />

          <form className="space-y-4" onSubmit={handleSubmit} method="POST">
            <div className="space-y-2">
              <Label htmlFor="usernameOrEmail">Username or Email</Label>
              <Input
                id="usernameOrEmail"
                name="usernameOrEmail"
                type="text"
                placeholder={!subdomain ? 'Admin username or email' : 'johndoe or john@example.com'}
                autoComplete="username"
                required
                disabled={loginSuccess}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                required
                disabled={loginSuccess}
              />
            </div>

            {error && (
              <Alert variant="destructive" className="text-sm">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {loginSuccess && (
              <Alert className="text-sm bg-green-50 text-green-700 border-green-200">
                <AlertDescription>Login successful! Redirecting...</AlertDescription>
              </Alert>
            )}

            {debugInfo && (
              <div className="text-xs text-gray-500 mt-2 p-2 bg-gray-100 rounded whitespace-pre-line">
                {debugInfo}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading || loginSuccess}>
              {loading ? 'Signing in...' : loginSuccess ? 'Redirecting...' : 'Sign in'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-sm text-center text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/register" className="text-primary font-medium hover:underline">
              Create account
            </Link>
          </div>

          {/* Development helper links */}
          {process.env.NODE_ENV === 'development' && (
            <div className="border-t border-gray-200 mt-4 pt-4 text-xs text-gray-500 w-full">
              <p className="mb-2 font-medium">Development Testing:</p>
              <div className="flex flex-col space-y-1">
                <a href="http://localhost:3000" className="underline hover:text-primary" target="_blank" rel="noopener noreferrer">
                  Tenant Manager Login (localhost)
                </a>
                <a href="http://test.localhost:3000" className="underline hover:text-primary" target="_blank" rel="noopener noreferrer">
                  Test Tenant Login (test.localhost)
                </a>
                <p className="mt-1 text-xs italic">
                  Note: For subdomain testing, add entries to your hosts file
                </p>
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
} 
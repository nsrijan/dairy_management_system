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
import { useAuth } from '../../providers';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Check if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Let middleware handle redirection if already authenticated
      router.refresh();
    }
  }, [isAuthenticated, router]);

  // Handle navigation after successful login
  useEffect(() => {
    if (loginSuccess) {
      console.log('Login successful, refreshing to let middleware redirect...');
      setTimeout(() => {
        router.refresh(); // Let middleware handle redirection
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
      setDebugInfo(`Connecting to backend at: ${apiUrl}/api/v1/auth/login`);

      const response = await loginUser({ usernameOrEmail, password });

      // Show success message
      console.log('Login successful, received token:', response.token.substring(0, 15) + '...');
      setDebugInfo(`Login successful! Redirecting to dashboard...`);

      // Use the auth context to login
      login(response.token, response.user, response.tenant);

      // Set success state to trigger the navigation effect
      setLoginSuccess(true);
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit} method="POST">
            <div className="space-y-2">
              <Label htmlFor="usernameOrEmail">Username or Email</Label>
              <Input
                id="usernameOrEmail"
                name="usernameOrEmail"
                type="text"
                placeholder="johndoe or john@example.com"
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
                <AlertDescription>Login successful! Redirecting to dashboard...</AlertDescription>
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
            <Link href="/auth/register" className="text-primary font-medium hover:underline">
              Create account
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 
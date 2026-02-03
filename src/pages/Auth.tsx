import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Star, Eye, EyeOff, Mail } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = loginSchema.extend({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { user, signIn, signUp } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: '', password: '', fullName: '', confirmPassword: '' },
  });

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const [pendingVerificationEmail, setPendingVerificationEmail] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    const { error } = await signIn(data.email, data.password);
    setIsLoading(false);

    if (error) {
      const errorMessage = error.message?.toLowerCase() || '';
      
      // Handle email not confirmed error
      if (errorMessage.includes('email not confirmed')) {
        setPendingVerificationEmail(data.email);
        toast({
          title: 'Email Not Verified',
          description: 'Please verify your email before logging in. Check your inbox or click "Resend" below.',
          variant: 'destructive',
        });
        return;
      }
      
      toast({
        title: 'Login Failed',
        description: error.message || 'Invalid email or password',
        variant: 'destructive',
      });
    } else {
      toast({ title: 'Welcome back!', description: 'You have successfully logged in.' });
      navigate('/');
    }
  };

  const handleResendVerification = async () => {
    if (!pendingVerificationEmail) return;
    
    setIsResending(true);
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: pendingVerificationEmail,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
      },
    });
    setIsResending(false);

    if (error) {
      toast({
        title: 'Failed to Resend',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Verification Email Sent!',
        description: `We've sent a new verification link to ${pendingVerificationEmail}. Please check your inbox and spam folder.`,
      });
    }
  };

  const handleSignup = async (data: SignupFormData) => {
    setIsLoading(true);
    const { error } = await signUp(data.email, data.password, data.fullName);
    setIsLoading(false);

    if (error) {
      let message = error.message;
      if (message.includes('already registered')) {
        message = 'This email is already registered. Please login instead.';
      }
      toast({
        title: 'Sign Up Failed',
        description: message,
        variant: 'destructive',
      });
    } else {
      setPendingVerificationEmail(data.email);
      toast({
        title: 'Account Created!',
        description: 'Please check your email (including spam folder) to verify your account before logging in.',
      });
      // Switch to login view so they can see the resend option
      setIsLogin(true);
    }
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md bg-cosmic-dark/80 border-cosmic-gold/30 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Star className="w-12 h-12 text-cosmic-gold animate-twinkle" />
            </div>
            <CardTitle className="text-2xl text-gradient-gold">
              {isLogin ? t('auth.login') : t('auth.signup')}
            </CardTitle>
            <CardDescription className="text-cosmic-silver">
              {isLogin 
                ? 'Enter your credentials to access your account' 
                : 'Create an account to start your cosmic journey'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLogin ? (
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-cosmic-silver">{t('auth.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    {...loginForm.register('email')}
                    className="bg-white border-cosmic-gold/30 text-black placeholder:text-gray-500"
                    placeholder="you@example.com"
                  />
                  {loginForm.formState.errors.email && (
                    <p className="text-red-400 text-sm">{loginForm.formState.errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-cosmic-silver">{t('auth.password')}</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      {...loginForm.register('password')}
                      className="bg-white border-cosmic-gold/30 text-black placeholder:text-gray-500 pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="text-red-400 text-sm">{loginForm.formState.errors.password.message}</p>
                  )}
                </div>
                {/* Resend verification email button */}
                {pendingVerificationEmail && (
                  <div className="p-3 bg-cosmic-gold/10 border border-cosmic-gold/30 rounded-lg">
                    <p className="text-sm text-cosmic-silver mb-2">
                      Didn't receive the verification email?
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-cosmic-gold/50 text-cosmic-gold hover:bg-cosmic-gold/20"
                      onClick={handleResendVerification}
                      disabled={isResending}
                    >
                      {isResending ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Mail className="w-4 h-4 mr-2" />
                      )}
                      Resend Verification Email
                    </Button>
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full bg-gradient-gold hover:opacity-90 text-cosmic-dark font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : t('auth.login')}
                </Button>
              </form>
            ) : (
              <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-cosmic-silver">{t('auth.fullName')}</Label>
                  <Input
                    id="fullName"
                    {...signupForm.register('fullName')}
                    className="bg-white border-cosmic-gold/30 text-black placeholder:text-gray-500"
                    placeholder="Your Name"
                  />
                  {signupForm.formState.errors.fullName && (
                    <p className="text-red-400 text-sm">{signupForm.formState.errors.fullName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signupEmail" className="text-cosmic-silver">{t('auth.email')}</Label>
                  <Input
                    id="signupEmail"
                    type="email"
                    {...signupForm.register('email')}
                    className="bg-white border-cosmic-gold/30 text-black placeholder:text-gray-500"
                    placeholder="you@example.com"
                  />
                  {signupForm.formState.errors.email && (
                    <p className="text-red-400 text-sm">{signupForm.formState.errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signupPassword" className="text-cosmic-silver">{t('auth.password')}</Label>
                  <div className="relative">
                    <Input
                      id="signupPassword"
                      type={showPassword ? "text" : "password"}
                      {...signupForm.register('password')}
                      className="bg-white border-cosmic-gold/30 text-black placeholder:text-gray-500 pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {signupForm.formState.errors.password && (
                    <p className="text-red-400 text-sm">{signupForm.formState.errors.password.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-cosmic-silver">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      {...signupForm.register('confirmPassword')}
                      className="bg-white border-cosmic-gold/30 text-black placeholder:text-gray-500 pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {signupForm.formState.errors.confirmPassword && (
                    <p className="text-red-400 text-sm">{signupForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-gold hover:opacity-90 text-cosmic-dark font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : t('auth.signup')}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  loginForm.reset();
                  signupForm.reset();
                }}
                className="text-cosmic-cyan hover:text-cosmic-gold transition-colors text-sm"
              >
                {isLogin ? t('auth.noAccount') : t('auth.hasAccount')}{' '}
                <span className="font-semibold">{isLogin ? t('auth.signup') : t('auth.login')}</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Auth;

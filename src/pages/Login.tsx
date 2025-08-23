import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Heart, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import heroImage from '@/assets/medical-hero.jpg';
import { useApi } from '@/hooks/useApi';

const Login = () => {
  const [emailId, setEmailId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ emailId?: string; password?: string; invalidCredentials?: string }>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  const { request } = useApi<{ token: string }>();

  const handleLogin = async () => {
    console.log("Attempting to login with", { emailId, password });
    if (!validateForm()) return;
    const res = await request("post", "/api/auth/login", {
      "emailId": emailId,
      "password": password,
    });
    if (res?.token) {
      console.log("Login successful, token received:", res.token);
      localStorage.setItem("token", res.token);
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        toast({
          title: "Login Successful",
        });
        navigate('/');
      }, 1500);
    }
    else {
      console.error("Login failed, invalid credentials");
      setErrors({ invalidCredentials: "Invalid emailId or password" });
    }    
  };

  const validateForm = () => {
    const newErrors: { emailId?: string; password?: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailId)
      newErrors.emailId = 'emailId is required';
    else if (!emailRegex.test(emailId))
      newErrors.emailId = 'Invalid email id format';

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 3) {
      newErrors.password = 'Password must be at least 3 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Hero image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-primary/20"></div>
        </div>
        <div className="relative z-10 p-12 flex flex-col justify-between text-white">
          <div className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-white" />
            <span className="text-2xl font-bold">Healix</span>
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-4">
              Professional Healthcare Management
            </h1>
            <p className="text-xl opacity-90">
              Streamline your medical practice with our comprehensive clinic management system.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-muted/30">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>
            
            <div className="lg:hidden flex items-center gap-2 mb-6">
              <Heart className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Healix</span>
            </div>
          </div>

          <Card className="border-border/50 shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
              <CardDescription className="text-center">
                Sign in to Healix
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emailId">Email Id</Label>
                  <Input
                    id="emailId"
                    type="text"
                    placeholder="Enter your email id"
                    value={emailId}
                    onChange={(e) => setEmailId(e.target.value)}
                    className={errors.emailId ? 'border-destructive' : ''}
                  />
                  {errors.emailId && (
                    <p className="text-sm text-destructive">{errors.emailId}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  )}
                </div>

                <div className="mt-4">
                  <p className="text-sm text-destructive">{errors.invalidCredentials}</p>
                </div>

                <div className="flex items-center justify-between">
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-primary hover:text-primary-hover underline-offset-4 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                  onClick={handleLogin}
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
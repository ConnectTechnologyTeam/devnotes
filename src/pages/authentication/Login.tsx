import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { loginUser, ApiError } from "@/lib/authService";
import { LogIn, Eye, EyeOff } from "lucide-react";

interface LoginFormData {
  email: string;
  password: string;
}

interface ValidationError {
  field: keyof LoginFormData;
  message: string;
}

// Constants for validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validation utility functions
const validateRequired = (value: string, fieldName: string): string | null => {
  if (!value.trim()) {
    return `${fieldName} is required.`;
  }
  return null;
};

const validateEmail = (email: string): string | null => {
  if (!EMAIL_REGEX.test(email)) {
    return "Please enter a valid email address.";
  }
  return null;
};

const Login = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = useCallback(
    (field: keyof LoginFormData) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
          ...prev,
          [field]: e.target.value,
        }));
      },
    []
  );

  const validateForm = useCallback((): boolean => {
    const errors: ValidationError[] = [];

    // Validate required fields
    const emailRequiredError = validateRequired(
      formData.email,
      "Email address"
    );
    if (emailRequiredError) {
      errors.push({ field: "email", message: emailRequiredError });
    } else {
      const emailFormatError = validateEmail(formData.email);
      if (emailFormatError) {
        errors.push({ field: "email", message: emailFormatError });
      }
    }

    const passwordRequiredError = validateRequired(
      formData.password,
      "Password"
    );
    if (passwordRequiredError) {
      errors.push({ field: "password", message: passwordRequiredError });
    }

    // Show first validation error
    if (errors.length > 0) {
      const firstError = errors[0];
      toast({
        title: "Validation Error",
        description: firstError.message,
        variant: "destructive",
      });
      return false;
    }

    return true;
  }, [formData, toast]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) return;

      setLoading(true);

      try {
        const response = await loginUser({
          email: formData.email.trim(),
          password: formData.password,
        });

        if (response.success) {
          toast({
            title: "Welcome back!",
            description:
              response.message || "You have been successfully logged in.",
          });
          navigate("/");
        } else {
          throw new ApiError(response.message || "Login failed");
        }
      } catch (error: unknown) {
        let errorMessage = "Invalid email or password";

        if (error instanceof ApiError) {
          errorMessage = error.message;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }

        toast({
          title: "Login failed",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [formData, navigate, toast, validateForm]
  );

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  // Common input props for password field
  const passwordInputProps = {
    disabled: loading,
    className: "h-11 pr-10",
    autoComplete: "current-password" as const,
  };

  const passwordToggleButtonProps = {
    type: "button" as const,
    variant: "ghost" as const,
    size: "sm" as const,
    className: "absolute right-0 top-0 h-11 px-3 py-2 hover:bg-transparent",
    disabled: loading,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-12 max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
              <LogIn className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold">Welcome back</CardTitle>
              <p className="text-muted-foreground">
                Sign in to your DevNotes account to continue
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleInputChange("email")}
                  disabled={loading}
                  className="h-11"
                  autoComplete="email"
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange("password")}
                    {...passwordInputProps}
                  />
                  <Button
                    {...passwordToggleButtonProps}
                    onClick={togglePasswordVisibility}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 text-base font-medium"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-primary hover:text-primary-hover font-medium transition-colors"
                >
                  Create one here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;

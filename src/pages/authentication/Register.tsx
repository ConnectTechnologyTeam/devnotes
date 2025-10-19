import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/lib/authService";
import { UserPlus, Eye, EyeOff } from "lucide-react";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface ValidationError {
  field: keyof RegisterFormData;
  message: string;
}

// Constants for validation
const MIN_PASSWORD_LENGTH = 6;
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

const validatePassword = (password: string): string | null => {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`;
  }
  return null;
};

const validatePasswordMatch = (
  password: string,
  confirmPassword: string
): string | null => {
  if (password !== confirmPassword) {
    return "Passwords don't match.";
  }
  return null;
};

const Register = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();
  const { register } = useAuth();

  const handleInputChange = useCallback(
    (field: keyof RegisterFormData) =>
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
    const nameError = validateRequired(formData.name, "Full name");
    if (nameError) errors.push({ field: "name", message: nameError });

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
    } else {
      const passwordLengthError = validatePassword(formData.password);
      if (passwordLengthError) {
        errors.push({ field: "password", message: passwordLengthError });
      }
    }

    const passwordMatchError = validatePasswordMatch(
      formData.password,
      formData.confirmPassword
    );
    if (passwordMatchError) {
      errors.push({ field: "confirmPassword", message: passwordMatchError });
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
        const success = await register(
          formData.email.trim(),
          formData.password,
          formData.name.trim()
        );

        if (success) {
          toast({
            title: "Account created successfully!",
            description:
              "Your account has been created. Please log in to continue.",
          });
          navigate("/login");
        }
      } catch (error: unknown) {
        let errorMessage = "An error occurred while creating your account.";

        if (error instanceof ApiError) {
          errorMessage = error.message;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }

        toast({
          title: "Registration failed",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [formData, navigate, toast, validateForm, register]
  );

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const toggleConfirmPasswordVisibility = useCallback(() => {
    setShowConfirmPassword((prev) => !prev);
  }, []);

  // Common input props for password fields
  const passwordInputProps = {
    disabled: loading,
    className: "h-11 pr-10",
    autoComplete: "new-password" as const,
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
              <UserPlus className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold">
                Create your account
              </CardTitle>
              <p className="text-muted-foreground">
                Join DevNotes and start sharing your knowledge
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange("name")}
                  disabled={loading}
                  className="h-11"
                  autoComplete="name"
                  autoFocus
                />
              </div>

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
                    placeholder="Create a password"
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

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium"
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange("confirmPassword")}
                    {...passwordInputProps}
                  />
                  <Button
                    {...passwordToggleButtonProps}
                    onClick={toggleConfirmPasswordVisibility}
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
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
                    <span>Creating account...</span>
                  </div>
                ) : (
                  "Create account"
                )}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary hover:text-primary-hover font-medium transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;

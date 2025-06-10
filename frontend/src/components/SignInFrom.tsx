import { useSignIn, useSignUp } from "@clerk/clerk-react";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Eye, EyeOff } from "lucide-react";

interface SignInFormProps {
  onClose: () => void;
}

const SignInForm = ({ onClose }: SignInFormProps) => {
  const { signIn, isLoaded: isSignInLoaded } = useSignIn();
  const { signUp, isLoaded: isSignUpLoaded } = useSignUp();

  const [isSignIn, setIsSignIn] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [error, setError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  if (!isSignInLoaded || !isSignUpLoaded) return <div>Loading...</div>;

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password: string) => password.length >= 8;

  const signInWithPassword = async () => {
    if (!username.trim()) return setError("Please enter your username.");
    if (!validatePassword(password))
      return setError("Password must be at least 8 characters.");
    setIsLoading(true);
    try {
      const result = await signIn.create({
        strategy: "password",
        identifier: username,
        password,
      });
      if (result.status === "complete") window.location.href = "/auth-callback";
      else setError("Incorrect username or password.");
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Sign in failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = () => {
    signIn.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/auth-callback",
    });
  };

  const signUpWithEmailAndPassword = async () => {
    if (!validateEmail(email)) return setError("Please enter a valid email.");
    if (!username.trim()) return setError("Please enter a username.");
    if (!validatePassword(password))
      return setError("Password must be at least 8 characters.");
    if (!firstName || !lastName)
      return setError("Please enter first and last name.");
    setIsLoading(true);
    try {
      const result = await signUp.create({
        emailAddress: email,
        username,
        password,
        firstName,
        lastName,
      });
      await result.prepareEmailAddressVerification({ strategy: "email_code" });
      setShowCodeInput(true);
      setError("Verification code sent to email.");
    } catch (err: any) {
      const code = err.errors?.[0]?.code;
      if (code === "form_identifier_exists")
        setError("Email or username already exists.");
      else setError(err.errors?.[0]?.message || "Sign up failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerificationCode = async () => {
    setIsLoading(true);
    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setError("Verification code resent to email.");
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Failed to resend code.");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCodeAndSignUp = async () => {
    if (!code.trim()) return setError("Enter verification code.");
    setIsLoading(true);
    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      if (result.status === "complete") window.location.href = "/auth-callback";
      else setError("Invalid code.");
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Verification failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const initiatePasswordReset = async () => {
    if (!validateEmail(email)) return setError("Enter a valid email.");
    setIsLoading(true);
    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      setShowCodeInput(true);
      setError("Reset code sent to email.");
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Reset request failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!code.trim()) return setError("Enter reset code.");
    if (!validatePassword(newPassword))
      return setError("New password too short.");
    setIsLoading(true);
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password: newPassword,
      });
      if (result.status === "complete") window.location.href = "/auth-callback";
      else setError("Reset failed.");
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Reset failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setUsername("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setCode("");
    setNewPassword("");
    setShowCodeInput(false);
    setError("");
    setIsSignIn(true);
    setIsForgotPassword(false);
  };

  return (
    <div className="p-6 max-w-sm w-full bg-zinc-900/80 rounded-xl shadow-2xl text-white relative">
      <button
        onClick={() => {
          resetForm();
          onClose();
        }}
        className="absolute top-3 right-4 text-white text-xl font-bold"
      >
        ×
      </button>

      <h2 className="text-3xl font-bold text-center mb-6">
        {isSignIn ? (isForgotPassword ? "Reset Password" : "Login") : "Sign Up"}
      </h2>

      <div className="flex flex-col gap-3">
        {isSignIn ? (
          isForgotPassword ? (
            <>
              <Input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {showCodeInput && (
                <>
                  <Input
                    placeholder="Code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                  <div className="relative">
                    <Input
                      placeholder="New Password"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-2 top-2 text-white"
                    >
                      {showNewPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={initiatePasswordReset}
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Resend Code"}
                  </Button>
                </>
              )}
              <Button
                onClick={showCodeInput ? resetPassword : initiatePasswordReset}
                disabled={isLoading}
              >
                {isLoading
                  ? "Please wait..."
                  : showCodeInput
                  ? "Reset Password"
                  : "Send Code"}
              </Button>
            </>
          ) : (
            <>
              <Input
                placeholder="Username or Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <div className="relative">
                <Input
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-2 text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="text-right text-sm">
                <button
                  onClick={() => setIsForgotPassword(true)}
                  className="text-blue-200 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <Button onClick={signInWithPassword} disabled={isLoading}>
                {isLoading ? "Signing in..." : "Login"}
              </Button>
              <Button onClick={signInWithGoogle} variant="outline">
                Sign in with Google
              </Button>
            </>
          )
        ) : (
          <>
            <Input
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <Input
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <div className="relative">
              <Input
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {showCodeInput && (
              <>
                <Input
                  placeholder="Verification Code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                <Button
                  variant="secondary"
                  onClick={resendVerificationCode}
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Resend Code"}
                </Button>
              </>
            )}
            <Button
              onClick={
                showCodeInput ? verifyCodeAndSignUp : signUpWithEmailAndPassword
              }
              disabled={isLoading}
            >
              {isLoading
                ? "Processing..."
                : showCodeInput
                ? "Verify & Sign Up"
                : "Create Account"}
            </Button>
          </>
        )}

        {error && (
          <div className="mt-2 bg-red-600/20 text-red-200 p-2 text-center rounded text-sm">
            {error}
          </div>
        )}

        <div className="text-center text-sm mt-4">
          {isSignIn ? (
            <>
              Don't have an account?{" "}
              <button
                onClick={() => {
                  setIsSignIn(false);
                  setError("");
                }}
                className="text-blue-200 underline"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => {
                  setIsSignIn(true);
                  setError("");
                }}
                className="text-blue-200 underline"
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignInForm;

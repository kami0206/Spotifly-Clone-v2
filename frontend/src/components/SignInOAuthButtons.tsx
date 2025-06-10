import { Button } from './ui/button';
import { useSignIn } from '@clerk/clerk-react';

const SignInOAuthButtons = () => {
    const {signIn, isLoaded} = useSignIn()

    if(!isLoaded) {
        return null;
    }
    const signInwithGoogle = async () => {
        signIn.authenticateWithRedirect({
            strategy: "oauth_google",
            redirectUrl: "/sso-callback",
            redirectUrlComplete: "/auth-callback",
        })
    }
  return (
    <Button onClick={signInwithGoogle} variant="secondary" className="w-full bg-white text-black hover:text-white border-zinc-200 h-12">
        Continue with Google
    </Button>
  )
}

export default SignInOAuthButtons
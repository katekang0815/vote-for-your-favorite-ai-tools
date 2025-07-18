import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const EmailSubscription = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    console.log('Email form submitted', { email });
    e.preventDefault();
    
    if (!email) {
      console.log('Email submission blocked: no email provided');
      return;
    }

    setIsSubmitting(true);
    setSubmissionStatus('idle');

    try {
      console.log('Attempting to submit email to Supabase:', email);
      
      // Check if email already exists
      const { data: existingEmail, error: checkError } = await supabase
        .from('email_submissions')
        .select('email')
        .eq('email', email.toLowerCase())
        .maybeSingle();

      if (checkError) {
        console.error('Error checking existing email:', checkError);
        throw checkError;
      }

      if (existingEmail) {
        console.log('Email already exists in database');
        throw new Error('This email is already subscribed!');
      }

      // Submit email to Supabase
      const { error } = await supabase
        .from('email_submissions')
        .insert([{ 
          email: email.toLowerCase(),
          ip_address: null,
          user_agent: navigator.userAgent
        }]);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Email submitted successfully to Supabase');
      
      // Set success status and clear form
      setSubmissionStatus('success');
      setEmail("");

      toast({
        title: "Success!",
        description: "Your email has been submitted successfully. Thank you for subscribing!",
        variant: "default",
      });

    } catch (error) {
      console.error('Error submitting email:', error);
      
      // Set error status but keep email in form for retry
      setSubmissionStatus('error');
      
      const errorMessage = error.message === 'This email is already subscribed!' 
        ? 'You are already subscribed!' 
        : 'Failed to submit email. Please check your connection and try again.';
      
      toast({
        title: "Submission Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setSubmissionStatus('idle');
      }, 3000);
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-6 items-center mt-8 sm:mt-12 md:mt-16 px-4">
      {/* Email Subscription Form */}
      <form
        onSubmit={handleEmailSubmit}
        className="flex flex-col sm:flex-row gap-3 max-w-md lg:max-w-lg xl:max-w-xl w-full"
      >
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                fill="currentColor"
              />
            </svg>
          </div>
          <Input
            type="email"
            placeholder="Enter your email to stay updated"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              // Reset status when user starts typing again
              if (submissionStatus !== 'idle') {
                setSubmissionStatus('idle');
              }
            }}
            className={`w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-800/50 border-gray-600/50 text-white placeholder-blue-600 rounded-lg focus:border-blue-400 focus:ring-blue-400 transition-all duration-300 ${
              submissionStatus === 'success' ? 'border-green-500 focus:border-green-500 focus:ring-green-500' :
              submissionStatus === 'error' ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
            }`}
            required
          />
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap ${
            submissionStatus === 'success' 
              ? 'bg-green-500 hover:bg-green-600 text-white' 
              : submissionStatus === 'error'
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 hover:from-green-500 hover:via-cyan-500 hover:to-blue-600 text-white'
          }`}
        >
          {isSubmitting ? "Submitting..." : 
           submissionStatus === 'success' ? "✓ Subscribed!" :
           submissionStatus === 'error' ? "Try Again" :
           "Subscribe"}
        </Button>
      </form>

      {/* Status Message */}
      {submissionStatus === 'success' && (
        <div className="text-green-400 text-sm animate-fade-in">
          🎉 Thank you for subscribing! You'll hear from us soon.
        </div>
      )}
      {submissionStatus === 'error' && (
        <div className="text-red-400 text-sm animate-fade-in">
          ❌ You are already subscribed!
        </div>
      )}
    </div>
  );
};

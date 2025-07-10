import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const EmailSubscription = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEmails, setSubmittedEmails] = useState<Set<string>>(
    new Set(),
  );
  const { toast } = useToast();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Check for duplicate email
    if (submittedEmails.has(email.toLowerCase())) {
      toast({
        title: "Already Submitted",
        description: "This email has already been submitted.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit email to Supabase
      const { error } = await supabase
        .from('email_submissions')
        .insert([{ 
          email: email.toLowerCase(),
          ip_address: null, // Could be captured if needed
          user_agent: navigator.userAgent
        }]);

      if (error) {
        throw error;
      }

      // Add email to submitted set to prevent duplicates
      setSubmittedEmails((prev) => new Set(prev).add(email.toLowerCase()));

      toast({
        title: "Success!",
        description: "Your email has been submitted successfully.",
        variant: "default",
      });
      setEmail("");
    } catch (error) {
      console.error('Error submitting email:', error);
      toast({
        title: "Error",
        description: "Failed to submit email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Load submitted emails from localStorage on component mount
  useEffect(() => {
    const savedEmails = localStorage.getItem("submittedEmails");
    if (savedEmails) {
      try {
        setSubmittedEmails(new Set(JSON.parse(savedEmails)));
      } catch (error) {
        // Clear invalid localStorage data
        localStorage.removeItem("submittedEmails");
      }
    }
  }, []);

  // Save submitted emails to localStorage whenever the set changes
  useEffect(() => {
    if (submittedEmails.size > 0) {
      localStorage.setItem(
        "submittedEmails",
        JSON.stringify(Array.from(submittedEmails)),
      );
    }
  }, [submittedEmails]);

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
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-800/50 border-gray-600/50 text-white placeholder-blue-600 rounded-lg focus:border-blue-400 focus:ring-blue-400"
            required
          />
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 hover:from-green-500 hover:via-cyan-500 hover:to-blue-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap"
        >
          {isSubmitting ? "Submitting..." : "Subscribe"}
        </Button>
      </form>
    </div>
  );
};
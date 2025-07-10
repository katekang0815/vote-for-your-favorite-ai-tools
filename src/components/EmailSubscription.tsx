import { useState } from "react";
import { Check, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export const EmailSubscription = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    // Here we would normally store the email in Supabase
    // For now, we'll just show a success message
    setIsSubmitted(true);
    
    toast({
      title: "Subscribed!",
      description: "Thanks for subscribing to updates.",
    });

    // Reset after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setEmail("");
    }, 3000);
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="email"
            placeholder="Enter your email to stay updated"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
            disabled={isSubmitted}
          />
        </div>
        <Button 
          type="submit" 
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          disabled={isSubmitted}
        >
          {isSubmitted ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Subscribed
            </>
          ) : (
            "Subscribe"
          )}
        </Button>
      </form>
    </div>
  );
};
import { useState, useEffect } from "react";
import { ToolCard } from "@/components/ToolCard";
import { EmailSubscription } from "@/components/EmailSubscription";
import { supabase } from "@/integrations/supabase/client";

interface Tool {
  id: string;
  name: string;
  icon: string;
  initialLikes: number;
}

interface UserLike {
  toolId: string;
  liked: boolean;
}

const tools: Tool[] = [
  { id: "chatgpt", name: "ChatGPT", icon: "🤖", initialLikes: 13 },
  { id: "copilot", name: "Copilot", icon: "👨‍✈️", initialLikes: 3 },
  { id: "canva", name: "Canva", icon: "🎨", initialLikes: 2 },
  { id: "claude", name: "Claude", icon: "🧠", initialLikes: 6 },
  { id: "lovable", name: "Lovable", icon: "💝", initialLikes: 4 },
  { id: "replit", name: "Replit", icon: "⚡", initialLikes: 4 },
  { id: "figma", name: "Figma", icon: "🎭", initialLikes: 3 },
  { id: "cursor", name: "Cursor", icon: "⚡", initialLikes: 8 },
  { id: "windsurf", name: "Windsurf", icon: "🏄", initialLikes: 2 },
  { id: "gemini", name: "Gemini", icon: "💎", initialLikes: 4 },
];

const Index = () => {
  const [userLikes, setUserLikes] = useState<UserLike[]>([]);
  const [voteCounts, setVoteCounts] = useState<Record<string, number>>({});
  const [currentUserId] = useState("anonymous-user"); // Anonymous user

  // Initialize user likes from localStorage and load vote counts from Supabase
  useEffect(() => {
    const savedLikes = localStorage.getItem(`userLikes-${currentUserId}`);
    if (savedLikes) {
      setUserLikes(JSON.parse(savedLikes));
    }

    // Load vote counts from Supabase
    const loadVoteCounts = async () => {
      try {
        const { data, error } = await supabase
          .from('tool_votes')
          .select('tool_id, vote_count');

        if (error) {
          console.error('Error loading vote counts:', error);
        } else if (data) {
          const counts = data.reduce((acc, row) => {
            acc[row.tool_id] = row.vote_count;
            return acc;
          }, {} as Record<string, number>);
          setVoteCounts(counts);
        }
      } catch (error) {
        console.error('Error fetching vote counts:', error);
      }
    };

    loadVoteCounts();
  }, [currentUserId]);

  // Save user likes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(`userLikes-${currentUserId}`, JSON.stringify(userLikes));
  }, [userLikes, currentUserId]);

  const handleToggleLike = async (toolId: string) => {
    const existingLike = userLikes.find(like => like.toolId === toolId);
    const wasLiked = existingLike?.liked || false;

    // Update local state immediately for responsiveness
    setUserLikes(prev => {
      const existing = prev.find(like => like.toolId === toolId);
      
      if (existing) {
        // Toggle existing like
        return prev.map(like => 
          like.toolId === toolId 
            ? { ...like, liked: !like.liked }
            : like
        );
      } else {
        // Create new like record
        return [...prev, { toolId, liked: true }];
      }
    });

    // Update vote count in Supabase based on like status
    try {
      if (!wasLiked) {
        // Increment vote when liking
        console.log('Incrementing vote for', toolId);
        const { data, error } = await supabase.rpc('increment_tool_vote', {
          tool_id_param: toolId
        });

        if (error) {
          console.error('Error incrementing vote:', error);
        } else {
          console.log('Vote incremented to:', data);
          setVoteCounts(prev => ({ ...prev, [toolId]: data }));
        }
      } else {
        // Decrement vote when unliking
        console.log('Decrementing vote for', toolId);
        const { data, error } = await supabase.rpc('decrement_tool_vote', {
          tool_id_param: toolId
        });

        if (error) {
          console.error('Error decrementing vote:', error);
        } else {
          console.log('Vote decremented to:', data);
          setVoteCounts(prev => ({ ...prev, [toolId]: data }));
        }
      }
    } catch (error) {
      console.error('Error updating vote:', error);
    }
  };

  const getLikeCount = (toolId: string) => {
    const tool = tools.find(t => t.id === toolId);
    const supabaseVotes = voteCounts[toolId] || 0;
    
    if (!tool) return supabaseVotes;
    
    // Combine initial likes with Supabase votes
    return tool.initialLikes + supabaseVotes;
  };

  const isLiked = (toolId: string) => {
    const userLike = userLikes.find(like => like.toolId === toolId);
    return userLike?.liked || false;
  };

  useEffect(() => {
    const texts = ["What's your favorite AI Tools?","Hover over icons...", "Vote!"];

    let currentTextIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    const typingElement = document.getElementById("typing-text");

    if (!typingElement) return;

    function typeText() {
      const currentText = texts[currentTextIndex];

      if (isDeleting) {
        typingElement!.textContent = currentText.substring(
          0,
          currentCharIndex - 1,
        );
        currentCharIndex--;
      } else {
        typingElement!.textContent = currentText.substring(
          0,
          currentCharIndex + 1,
        );
        currentCharIndex++;
      }

      // Handle "Vote!" text with shake animation and larger size
      if (currentText === "Vote!") {
        typingElement!.classList.add("text-3xl", "md:text-4xl", "2xl:text-5xl", "font-bold", "gradient-text");
        typingElement!.classList.remove("text-xl", "md:text-2xl", "2xl:text-3xl", "text-blue-400");

        // Only add shake when "Vote!" is fully typed and not already shaking
        if (!isDeleting && currentCharIndex === currentText.length && !typingElement!.dataset.shaking) {
          typingElement!.dataset.shaking = "true";
          
          // Apply CSS shake animation directly
          typingElement!.style.animation = "shake 0.8s ease-in-out infinite";
          
        } else if (isDeleting && currentCharIndex === currentText.length - 1) {
          // Reset when starting to delete
          typingElement!.style.animation = '';
          delete typingElement!.dataset.shaking;
        }
      } else {
        // Remove shake and reset size for other text
        typingElement!.classList.remove("animate-shake", "shake-animation", "text-3xl", "md:text-4xl", "2xl:text-5xl", "font-bold");
        typingElement!.classList.add("text-xl", "md:text-2xl", "2xl:text-3xl", "gradient-text");
      }

      let typeSpeed = isDeleting ? 50 : 100;

      if (!isDeleting && currentCharIndex === currentText.length) {
        typeSpeed = 2000; // Pause at end
        isDeleting = true;
      } else if (isDeleting && currentCharIndex === 0) {
        isDeleting = false;
        currentTextIndex = (currentTextIndex + 1) % texts.length;
        typeSpeed = 500; // Pause before next text
      }

      setTimeout(typeText, typeSpeed);
    }

    typeText();
  }, []);

  return (
    <section className="hero-gradient min-h-screen flex items-center justify-center px-2 sm:px-4 py-8 sm:py-12 md:py-16">
      <div className="w-full max-w-screen-2xl mx-auto text-center relative z-10">
        {/* Hero Content */}
        <div className="mb-8 sm:mb-12 md:mb-16">
          <div className="mb-6 sm:mb-8 max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto h-12 sm:h-14 md:h-16 lg:h-18 xl:h-20 flex items-center justify-center px-4">
            <div className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl gradient-text leading-relaxed">
              <span id="typing-text"></span>
            </div>
          </div>

          {/* Tools Grid */}
           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 2xl:gap-16 w-full max-w-screen-2xl mx-auto relative z-10 p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 2xl:p-16 rounded-2xl bg-background/30">

            {tools.map((tool) => (
              <ToolCard
                key={tool.id}
                id={tool.id}
                name={tool.name}
                icon={tool.icon}
                likeCount={getLikeCount(tool.id)}
                isLiked={isLiked(tool.id)}
                onToggleLike={handleToggleLike}
              />
            ))}
          </div>

          {/* Email Subscription */}
          <div className="max-w-2xl mx-auto">
            <EmailSubscription />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Index;

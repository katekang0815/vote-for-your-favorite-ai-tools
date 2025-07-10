import { useState, useEffect } from "react";
import { ToolCard } from "@/components/ToolCard";
import { EmailSubscription } from "@/components/EmailSubscription";

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
  const [currentUserId] = useState("user-1"); // Simulating a logged-in user

  // Initialize user likes from localStorage
  useEffect(() => {
    const savedLikes = localStorage.getItem(`userLikes-${currentUserId}`);
    if (savedLikes) {
      setUserLikes(JSON.parse(savedLikes));
    }
  }, [currentUserId]);

  // Save user likes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(`userLikes-${currentUserId}`, JSON.stringify(userLikes));
  }, [userLikes, currentUserId]);

  const handleToggleLike = (toolId: string) => {
    setUserLikes(prev => {
      const existingLike = prev.find(like => like.toolId === toolId);
      
      if (existingLike) {
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
  };

  const getLikeCount = (toolId: string) => {
    const tool = tools.find(t => t.id === toolId);
    const userLike = userLikes.find(like => like.toolId === toolId);
    
    if (!tool) return 0;
    
    // Start with initial likes and adjust based on user's like status
    let count = tool.initialLikes;
    if (userLike?.liked) {
      count += 1;
    }
    
    return count;
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

        // Only add shake when "Vote!" is fully typed
        if (!isDeleting && currentCharIndex === currentText.length) {
          console.log("Adding shake animation to Vote!");
          // Force animation restart by removing and re-adding the class
          typingElement!.classList.remove("animate-shake");
          // Use requestAnimationFrame for better timing
          requestAnimationFrame(() => {
            typingElement!.classList.add("animate-shake");
          });
        } else if (isDeleting && currentCharIndex === currentText.length - 1) {
          // Remove shake when starting to delete
          console.log("Removing shake animation");
          typingElement!.classList.remove("animate-shake");
        }
      } else {
        // Remove shake and reset size for other text
        typingElement!.classList.remove("animate-shake", "text-3xl", "md:text-4xl", "2xl:text-5xl", "font-bold");
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
      <div className="max-w-6xl mx-auto text-center relative z-10 w-full">
        {/* Hero Content */}
        <div className="mb-8 sm:mb-12 md:mb-16">
          <div className="mb-6 sm:mb-8 max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto h-12 sm:h-14 md:h-16 lg:h-18 xl:h-20 flex items-center justify-center px-4">
            <div className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl gradient-text leading-relaxed">
              <span id="typing-text"></span>
            </div>
          </div>

          {/* Tools Grid */}
           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 2xl:gap-16 w-full max-w-screen-2xl mx-auto relative z-10 p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 2xl:p-16 rounded-2xl">

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

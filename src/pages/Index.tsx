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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-vote-title mb-8">Vote!</h1>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 2xl:gap-16 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl mx-auto relative z-10 p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 2xl:p-16 rounded-2xl mb-16">
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
  );
};

export default Index;

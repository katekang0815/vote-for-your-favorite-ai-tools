import { Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ToolCardProps {
  id: string;
  name: string;
  icon: string;
  likeCount: number;
  isLiked: boolean;
  onToggleLike: (toolId: string) => void;
}

export const ToolCard = ({ id, name, icon, likeCount, isLiked, onToggleLike }: ToolCardProps) => {
  return (
    <Card className="relative bg-card border-border p-6 rounded-xl hover:bg-secondary/50 transition-colors group">
      {/* Heart button */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-3 right-3 h-8 w-8 p-0 hover:bg-transparent"
        onClick={() => onToggleLike(id)}
      >
        <Heart 
          className={`h-5 w-5 transition-colors ${
            isLiked 
              ? "fill-like-button text-like-button" 
              : "text-muted-foreground hover:text-like-button"
          }`}
        />
      </Button>

      {/* Tool icon */}
      <div className="flex justify-center mb-4 mt-2">
        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
          <span className="text-2xl">{icon}</span>
        </div>
      </div>

      {/* Tool name */}
      <h3 className="text-center font-medium text-foreground mb-4">{name}</h3>

      {/* Like count */}
      <div className="absolute bottom-3 right-3">
        <span className="text-like-count font-bold text-lg">{likeCount}</span>
      </div>
    </Card>
  );
};
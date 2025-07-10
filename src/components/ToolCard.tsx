import { useCallback } from "react";
import {
  Code,
  Zap,
  TreePine,
  Palette,
  Heart,
  RefreshCw,
  Pointer,
  Terminal,
  Circle,
  Square,
  Layers,
  MessageSquare,
  Wind,
} from "lucide-react";

interface ToolDisplay {
  name: string;
  icon: JSX.Element;
  gradientFrom: string;
  gradientTo: string;
  brandIcon?: string;
}

const toolDisplayConfig: ToolDisplay[] = [
  {
    name: "ChatGPT",
    icon: <MessageSquare className="w-8 h-8 text-white" />,
    gradientFrom: "from-green-500",
    gradientTo: "to-green-700",
    brandIcon:
      "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
  },
  {
    name: "Copilot",
    icon: <Zap className="w-8 h-8 text-white" />,
    gradientFrom: "from-blue-600",
    gradientTo: "to-indigo-700",
    brandIcon:
      "https://github.githubassets.com/images/modules/site/copilot/copilot.png",
  },
  {
    name: "Canva",
    icon: <TreePine className="w-8 h-8 text-white" />,
    gradientFrom: "from-purple-500",
    gradientTo: "to-violet-600",
    brandIcon:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3DOVfJ3byuTZsaWnGQb8O6w-y9_zkwweOnw&s",
  },
  {
    name: "Claude",
    icon: <Palette className="w-8 h-8 text-white" />,
    gradientFrom: "from-orange-500",
    gradientTo: "to-orange-700",
    brandIcon:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCIZYpPXuiY_Dw0M0ffBoN8X8zsUKVvPsn8mAUb_t5zWUKXtrCMWzyYwU&s",
  },
  {
    name: "Lovable",
    icon: <Heart className="w-8 h-8 text-white" />,
    gradientFrom: "from-pink-500",
    gradientTo: "to-rose-600",
    brandIcon: "https://lovable.dev/favicon.ico",
  },
  {
    name: "Replit",
    icon: <Terminal className="w-8 h-8 text-white" />,
    gradientFrom: "from-orange-400",
    gradientTo: "to-red-500",
    brandIcon:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-HnpgESCXTePDDnjoCQ62_tcBT0_2NFygWhY-9irhL0-I2SPB_LS6GE0&s",
  },
  {
    name: "Figma",
    icon: <Square className="w-8 h-8 text-white" />,
    gradientFrom: "from-red-500",
    gradientTo: "to-purple-600",
    brandIcon:
      "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg",
  },
  {
    name: "Cursor",
    icon: <Pointer className="w-8 h-8 text-white" />,
    gradientFrom: "from-blue-500",
    gradientTo: "to-cyan-600",
    brandIcon:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQosGiHkTgcRjw4jfE7diGzPub1TYhReObk8g&s",
  },
  {
    name: "Windsurf",
    icon: <Wind className="w-8 h-8 text-white" />,
    gradientFrom: "from-teal-400",
    gradientTo: "to-blue-500",
    brandIcon: "https://windsurf.ai/favicon.ico",
  },
  {
    name: "Gemini",
    icon: <Layers className="w-8 h-8 text-white" />,
    gradientFrom: "from-blue-500",
    gradientTo: "to-purple-600",
    brandIcon:
      "https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg",
  },
];

interface ToolCardProps {
  id: string;
  name: string;
  icon: string;
  likeCount: number;
  isLiked: boolean;
  onToggleLike: (toolId: string) => void;
}

export const ToolCard = ({ id, name, icon, likeCount, isLiked, onToggleLike }: ToolCardProps) => {
  const getToolDisplayConfig = useCallback((toolName: string): ToolDisplay => {
    return (
      toolDisplayConfig.find((config) => config.name === toolName) || {
        name: toolName,
        icon: <Circle className="w-8 h-8 text-white" />,
        gradientFrom: "from-gray-500",
        gradientTo: "to-gray-600",
      }
    );
  }, []);

  const displayConfig = getToolDisplayConfig(name);

  return (
    <div className="tool-item flex flex-col items-center group opacity-100">
      <div className="relative p-3 sm:p-4 md:p-5 2xl:px-6 2xl:py-6 bg-gray-900 rounded-lg hover:bg-gray-800 transition-all duration-300 w-full">
        <div className="flex flex-col items-center">
          <div className="tool-icon w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-18 lg:h-18 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shadow-lg mb-2 sm:mb-3 md:mb-4 2xl:mb-6">
            {displayConfig.brandIcon ? (
              <img
                src={displayConfig.brandIcon}
                alt={`${name} icon`}
                className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10"
              />
            ) : (
              <div className="text-white scale-50 sm:scale-75 md:scale-100 lg:scale-110 xl:scale-125 2xl:scale-150">
                {displayConfig.icon}
              </div>
            )}
          </div>
          <span className="text-xs sm:text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl font-medium text-white group-hover:text-gray-200 transition-colors duration-300 text-center leading-tight">
            {name}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleLike(id);
          }}
          className={`
            absolute -top-1 -right-1 sm:-top-2 sm:-right-2 2xl:-top-3 2xl:-right-3
            w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12
            flex items-center justify-center
            transition-all duration-300 hover:scale-110
            ${isLiked ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
          `}
        >
          <Heart
            className={`
              w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10
              stroke-2 transition-all duration-300
              ${
                isLiked
                  ? "fill-red-500 stroke-red-500"
                  : "fill-none stroke-red-500"
              }
            `}
          />
        </button>
        {likeCount > 0 && (
          <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 2xl:-bottom-3 2xl:-right-3 bg-gray-500/50 text-green-400 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl rounded-full w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14 flex items-center justify-center font-bold transition-all duration-300">
            {likeCount}
          </div>
        )}
      </div>
    </div>
  );
};
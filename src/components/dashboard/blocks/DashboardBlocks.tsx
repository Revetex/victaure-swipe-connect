
import { motion } from "framer-motion";
import { useProfile } from "@/hooks/useProfile";
import { DashboardBlock } from "./DashboardBlock";
import { 
  User, Users, Image, Star, ThumbsUp, Share2, MessageSquare, Eye,
  Bell, Newspaper, Briefcase // Added new icons
} from "lucide-react";
import { cn } from "@/lib/utils";

export function DashboardBlocks() {
  const { profile } = useProfile();

  const blocks = [
    {
      icon: User,
      title: "Profil",
      description: "Mon profil complet",
      color: "bg-blue-500/10",
      textColor: "text-blue-500",
      route: "/profile"
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "Centre de notifications",
      color: "bg-red-500/10",
      textColor: "text-red-500",
      route: "/notifications"
    },
    {
      icon: Newspaper,
      title: "Actualités",
      description: "Fil d'actualités",
      color: "bg-emerald-500/10",
      textColor: "text-emerald-500",
      route: "/feed"
    },
    {
      icon: Briefcase,
      title: "Missions",
      description: "Missions disponibles",
      color: "bg-violet-500/10",
      textColor: "text-violet-500",
      route: "/jobs"
    },
    {
      icon: Eye,
      title: "Vues",
      description: "152 vues cette semaine",
      color: "bg-green-500/10", 
      textColor: "text-green-500",
      stats: "152"
    },
    {
      icon: MessageSquare,
      title: "Matchs",
      description: "8 matchs réussis",
      color: "bg-purple-500/10",
      textColor: "text-purple-500",
      stats: "8"
    },
    {
      icon: Share2,
      title: "Posts",
      description: "12 posts partagés",
      color: "bg-orange-500/10",
      textColor: "text-orange-500",
      stats: "12"
    },
    {
      icon: ThumbsUp,
      title: "Likes",
      description: "45 likes reçus",
      color: "bg-pink-500/10",
      textColor: "text-pink-500",
      stats: "45"
    },
    {
      icon: Star,
      title: "Feedback",
      description: "4.8/5 étoiles",
      color: "bg-yellow-500/10",
      textColor: "text-yellow-500",
      stats: "4.8"
    },
    {
      icon: Image,
      title: "Photos",
      description: "Galerie photos",
      color: "bg-indigo-500/10",
      textColor: "text-indigo-500",
      route: "/photos"
    },
    {
      icon: Users,
      title: "Amis",
      description: "23 connections",
      color: "bg-teal-500/10",
      textColor: "text-teal-500",
      stats: "23"
    }
  ];

  return (
    <div className="relative w-full min-h-[80vh] bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 perspective-1000">
      {/* 3D Scene Container */}
      <div className="absolute inset-0 perspective-1000">
        {/* Animated Grid Lines */}
        <div className="absolute inset-0 grid grid-cols-8 gap-4 opacity-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-full border-r border-primary/20" />
          ))}
        </div>
        <div className="absolute inset-0 grid grid-rows-8 gap-4 opacity-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="w-full border-b border-primary/20" />
          ))}
        </div>
      </div>
      
      {/* Blocks Grid */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4"
      >
        {blocks.map((block, index) => (
          <DashboardBlock 
            key={index}
            icon={block.icon}
            title={block.title}
            description={block.description}
            color={block.color}
            textColor={block.textColor}
            stats={block.stats}
            route={block.route}
            delay={index * 0.1}
          />
        ))}
      </motion.div>
    </div>
  );
}

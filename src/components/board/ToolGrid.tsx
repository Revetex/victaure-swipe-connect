import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ToolCard } from "./ToolCard";
import { Tool } from "@/types/todo";

interface ToolGridProps {
  tools: Tool[];
}

export function ToolGrid({ tools }: ToolGridProps) {
  const navigate = useNavigate();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {tools.map((tool) => (
        <motion.div
          key={tool.name}
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ToolCard
            name={tool.name}
            icon={tool.icon}
            description={tool.description}
            color={tool.color}
            onClick={() => navigate(tool.path)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
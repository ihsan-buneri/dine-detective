
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <section id="hero" className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mb-12"
      >
        <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 font-futuristic">
          Sarah
        </h1>
        <h2 className="text-2xl md:text-4xl font-light text-cyan-300 mb-4">
          NEXUS AI HUB
        </h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8"
        >
          Discover. Book. Buy.{" "}
          <span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text font-semibold">
            Everything Powered by AI.
          </span>
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mb-16"
      >
        <Button
          onClick={onGetStarted}
          className="relative px-12 py-6 text-xl cursor-pointer font-semibold bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white border-0 rounded-full shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 group overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <span className="relative z-10">Get Started Now</span>
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.8 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ 
            y: [0, 10, 0],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="flex flex-col items-center cursor-pointer group"
          onClick={() => {
            document.getElementById('features')?.scrollIntoView({ 
              behavior: 'smooth' 
            });
          }}
        >
          <p className="text-gray-400 text-sm mb-2 group-hover:text-cyan-300 transition-colors duration-300">
            Scroll to explore
          </p>
          <ChevronDown 
            size={32} 
            className="text-cyan-400 group-hover:text-cyan-300 transition-all duration-300 drop-shadow-lg" 
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

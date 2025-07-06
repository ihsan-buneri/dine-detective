
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Sparkles, BarChart3, Rocket } from "lucide-react";

const sections = [
  { id: "hero", label: "Home", icon: Home },
  { id: "features", label: "Features", icon: Sparkles },
  { id: "stats", label: "Stats", icon: BarChart3 },
  { id: "cta", label: "Get Started", icon: Rocket }
];

export const ScrollSpy = () => {
  const [activeSection, setActiveSection] = useState("hero");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      // Show/hide scrollspy based on scroll position
      setIsVisible(scrollPosition > 200);

      // Find active section
      const sectionElements = sections.map(section => ({
        id: section.id,
        element: document.getElementById(section.id),
        top: document.getElementById(section.id)?.offsetTop || 0
      }));

      const currentSection = sectionElements
        .filter(section => section.element)
        .reverse()
        .find(section => scrollPosition >= section.top - 200);

      if (currentSection) {
        setActiveSection(currentSection.id);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          className="fixed right-6 top-1/2 -translate-y-1/2 z-50"
        >
          <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl p-4 shadow-2xl">
            <div className="space-y-3">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                
                return (
                  <motion.button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className="relative group block"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className={`
                      relative w-12 h-12 rounded-xl flex items-center justify-center
                      transition-all duration-300 cursor-pointer
                      ${isActive 
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-600 shadow-lg shadow-cyan-500/25' 
                        : 'bg-white/5 hover:bg-white/10'
                      }
                    `}>
                      <Icon 
                        className={`w-5 h-5 transition-colors duration-300 ${
                          isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                        }`} 
                      />
                      
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-xl opacity-20"
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.2, 0.4, 0.2],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                      )}
                    </div>
                    
                    {/* Tooltip */}
                    <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="bg-black/80 backdrop-blur-sm text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap border border-white/10">
                        {section.label}
                        <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-black/80"></div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
            
            {/* Progress indicator */}
            <div className="mt-4 w-1 h-16 bg-white/10 rounded-full mx-auto relative overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 w-full bg-gradient-to-b from-cyan-400 to-purple-500 rounded-full"
                style={{
                  height: `${((sections.findIndex(s => s.id === activeSection) + 1) / sections.length) * 100}%`
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface CTASectionProps {
  onGetStarted: () => void;
}

export const CTASection = ({ onGetStarted }: CTASectionProps) => {
  return (
    <section id="cta" className="relative z-10 py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 backdrop-blur-lg border border-white/10 rounded-3xl p-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-futuristic">
            Ready to <span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">Get Started?</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Experience the future of digital services with our advanced AI. Start your journey today.
          </p>
          <Button
            onClick={onGetStarted}
            className="px-8 py-4 text-lg cursor-pointer font-semibold bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white border-0 rounded-full shadow-xl hover:shadow-cyan-500/25 transition-all duration-300"
          >
            Start Free Today
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

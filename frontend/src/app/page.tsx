"use client";
import React from "react";
import { useState } from "react";
import { ParticleBackground } from "@/components/ParticleBackground";
import { ChatInterface } from "@/components/ChatInterface";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { StatsSection } from "@/components/StatsSection";
import { CTASection } from "@/components/CTASection";
import { ScrollSpy } from "@/components/ScrollSpy";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [showChat, setShowChat] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black overflow-hidden relative">
      <ParticleBackground />
      
      <AnimatePresence mode="wait">
        {!showChat ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <HeroSection onGetStarted={() => setShowChat(true)} />
            <FeaturesSection />
            <StatsSection />
            <CTASection onGetStarted={() => setShowChat(true)} />
            <ScrollSpy />
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            <ChatInterface onBack={() => setShowChat(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

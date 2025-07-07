"use client";
import React from "react";
import { ParticleBackground } from "@/components/ParticleBackground";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { StatsSection } from "@/components/StatsSection";
import { CTASection } from "@/components/CTASection";
import { ScrollSpy } from "@/components/ScrollSpy";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black overflow-hidden relative">
      <ParticleBackground />

      <AnimatePresence mode="wait">
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <HeroSection onGetStarted={() => router.push('/chat')} />
          <FeaturesSection />
          <StatsSection />
          <CTASection onGetStarted={() => router.push('/chat')} />
          <ScrollSpy />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

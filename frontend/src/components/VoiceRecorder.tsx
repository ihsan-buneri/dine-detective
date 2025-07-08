
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { motion } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Define the SpeechRecognition interface
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

// Extend Window interface for speech recognition
type SpeechRecognitionConstructor = new () => SpeechRecognition;

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
  }
}

interface VoiceRecorderProps {
  isListening: boolean;
  onToggle: () => void;
  onTranscript: (transcript: string) => void;
}

export const VoiceRecorder = ({ isListening, onToggle, onTranscript }: VoiceRecorderProps) => {
  const [isSupported, setIsSupported] = useState(false);
  const [showUnsupportedModal, setShowUnsupportedModal] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
      const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognitionConstructor();

      if (recognitionRef.current) {
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'pt-PT';

        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0]?.item(0)?.transcript;
          if (transcript) {
            onTranscript(transcript);
          }
        };

        recognitionRef.current.onend = () => {
          // Auto-stop listening when speech recognition ends
          if (isListening) {
            onToggle();
          }
        };

        recognitionRef.current.onerror = (event) => {
          // Only log errors that are not common user interaction issues
          if (event.error !== 'no-speech' && event.error !== 'aborted') {
            console.error('Speech recognition error:', event.error);
          }

          // Stop listening on any error
          if (isListening) {
            onToggle();
          }
        };
      }
    }
  }, [onTranscript, isListening, onToggle]);

  useEffect(() => {
    if (recognitionRef.current && isSupported) {
      if (isListening) {
        try {
          recognitionRef.current.start();
        } catch (error) {
          console.error('Error starting speech recognition:', error);
          onToggle();
        }
      } else {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          // Ignore errors when stopping - this is expected behavior
        }
      }
    }
  }, [isListening, isSupported, onToggle]);

  const handleToggle = () => {
    if (!isSupported) {
      setShowUnsupportedModal(true);
      return;
    }
    onToggle();
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggle}
        className={`cursor-pointer relative ${isListening
          ? "text-red-400 hover:text-red-300 hover:bg-red-500/10"
          : isSupported
            ? "text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10"
            : "text-gray-600 hover:text-gray-500 hover:bg-gray-500/10"
          }`}
        title={isSupported ? "Click to start voice recording" : "Voice recording not supported in this browser"}
      >
        {isListening && isSupported ? (
          <>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute inset-0 bg-red-500/20 rounded-full"
            />
            <MicOff className="w-5 h-5 relative z-10" />
          </>
        ) : (
          <Mic className="w-5 h-5" />
        )}
      </Button>

      <AlertDialog open={showUnsupportedModal} onOpenChange={setShowUnsupportedModal}>
        <AlertDialogContent className="bg-gray-900 border-gray-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-cyan-400">
              Voice Recognition Not Supported
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Your browser does not support voice recognition.
              To use this feature, we recommend one of the following browsers:
              <br /><br />
              • <strong>Chrome</strong> (recommended)
              <br />
              • <strong>Safari</strong>
              <br />
              • <strong>Microsoft Edge</strong>
              <br /><br />
              Alternatively, you can continue the conversation by typing your messages.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setShowUnsupportedModal(false)}
              className="bg-cyan-500 cursor-pointer hover:bg-cyan-600 text-white"
            >
              Got it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

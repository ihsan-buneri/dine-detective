import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { motion } from "framer-motion";

// Extend Window interface for speech recognition
declare global {
	interface Window {
		SpeechRecognition: (typeof window)["SpeechRecognition"];
		webkitSpeechRecognition: (typeof window)["webkitSpeechRecognition"];
	}
}

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

interface VoiceRecorderProps {
	isListening: boolean;
	onToggle: () => void;
	onTranscript: (transcript: string) => void;
}

export const VoiceRecorder = ({
	isListening,
	onToggle,
	onTranscript,
}: VoiceRecorderProps) => {
	const [isSupported, setIsSupported] = useState(false);
	const recognitionRef = useRef<SpeechRecognition | null>(null);

	useEffect(() => {
		if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
			setIsSupported(true);
			const SpeechRecognitionConstructor =
				(window as any).SpeechRecognition ||
				(window as any).webkitSpeechRecognition;
			recognitionRef.current = new SpeechRecognitionConstructor();

			if (recognitionRef.current) {
				recognitionRef.current.continuous = false;
				recognitionRef.current.interimResults = false;
				recognitionRef.current.lang = "en-US";

				recognitionRef.current.onresult = (event) => {
					const transcript = event.results[0]?.item(0)?.transcript;
					if (transcript) {
						onTranscript(transcript);
					}
				};

				recognitionRef.current.onend = () => {
					// Auto-stop listening when speech recognition ends
				};

				recognitionRef.current.onerror = (event) => {
					console.error("Speech recognition error:", event.error);
				};
			}
		}
	}, [onTranscript]);

	useEffect(() => {
		if (recognitionRef.current) {
			if (isListening) {
				recognitionRef.current.start();
			} else {
				recognitionRef.current.stop();
			}
		}
	}, [isListening]);

	if (!isSupported) {
		return null;
	}

	return (
		<Button
			variant='ghost'
			size='sm'
			onClick={onToggle}
			className={`relative ${
				isListening
					? "text-red-400 hover:text-red-300 hover:bg-red-500/10"
					: "text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10"
			}`}
		>
			{isListening ? (
				<>
					<motion.div
						animate={{ scale: [1, 1.2, 1] }}
						transition={{ duration: 1, repeat: Infinity }}
						className='absolute inset-0 bg-red-500/20 rounded-full'
					/>
					<MicOff className='w-5 h-5 relative z-10' />
				</>
			) : (
				<Mic className='w-5 h-5' />
			)}
		</Button>
	);
};

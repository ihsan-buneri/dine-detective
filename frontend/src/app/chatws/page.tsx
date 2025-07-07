"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
	id: string;
	text: string;
	isUser: boolean;
	timestamp: Date;
	ttsAudioUrl?: string; // for AI replies with audio
}

const ChatPage = () => {
	const [messages, setMessages] = useState<Message[]>([]);
	const [inputValue, setInputValue] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const [recording, setRecording] = useState(false);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const audioChunksRef = useRef<Blob[]>([]);

	const ws = useRef<WebSocket | null>(null);

	useEffect(() => {
		ws.current = new WebSocket("ws://localhost:8000/ws/chat-text-audio");
		ws.current.onopen = () => {
			console.log("WebSocket connected");
		};
		ws.current.onmessage = (event) => {
			const msg = JSON.parse(event.data);
			if (msg.error) {
				console.error("WS error:", msg.error);
				setIsLoading(false);
				return;
			}

			// AI response
			const aiMessage: Message = {
				id: Date.now().toString(),
				text: msg.response_text,
				isUser: false,
				timestamp: new Date(),
				// create a blob URL from Base64 TTS data
				ttsAudioUrl: msg.tts_data
					? URL.createObjectURL(
							new Blob(
								[Uint8Array.from(atob(msg.tts_data), (c) => c.charCodeAt(0))],
								{
									type: "audio/mp3",
								}
							)
					  )
					: undefined,
			};
			setMessages((prev) => [...prev, aiMessage]);
			setIsLoading(false);
		};
		ws.current.onclose = () => console.log("WebSocket closed");
		return () => {
			ws.current?.close();
		};
	}, []);

	// auto-scroll
	const messagesEndRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	// Send text or audio JSON frame
	const sendMessage = (payload: object) => {
		if (ws.current && ws.current.readyState === WebSocket.OPEN) {
			ws.current.send(JSON.stringify(payload));
			setIsLoading(true);
		}
	};

	// Text handler
	const handleSendText = () => {
		if (!inputValue.trim()) return;
		const userMsg: Message = {
			id: Date.now().toString(),
			text: inputValue,
			isUser: true,
			timestamp: new Date(),
		};
		setMessages((prev) => [...prev, userMsg]);

		sendMessage({
			user_id: 1,
			chat_id: 1,
			is_audio: false,
			text: inputValue,
		});

		setInputValue("");
	};

	// Audio recording handlers
	const startRecording = async () => {
		if (recording) return;
		const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
		const recorder = new MediaRecorder(stream);
		mediaRecorderRef.current = recorder;
		audioChunksRef.current = [];

		recorder.ondataavailable = (ev) => audioChunksRef.current.push(ev.data);
		recorder.onstop = async () => {
			const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
			const arrayBuffer = await blob.arrayBuffer();
			const b64 = btoa(
				new Uint8Array(arrayBuffer).reduce(
					(data, byte) => data + String.fromCharCode(byte),
					""
				)
			);
			const filename = `record-${Date.now()}.webm`;
			const contentType = blob.type;

			// show placeholder user message
			const userMsg: Message = {
				id: Date.now().toString(),
				text: "[voice message]",
				isUser: true,
				timestamp: new Date(),
			};
			setMessages((prev) => [...prev, userMsg]);

			sendMessage({
				user_id: 1,
				chat_id: 1,
				is_audio: true,
				filename,
				content_type: contentType,
				data: b64,
			});
		};

		recorder.start();
		setRecording(true);
	};

	const stopRecording = () => {
		if (!recording || !mediaRecorderRef.current) return;
		mediaRecorderRef.current.stop();
		setRecording(false);
	};

	return (
		<div className='min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-black'>
			<div className='w-full max-w-2xl bg-black/40 rounded-lg shadow-lg p-6'>
				<div className='mb-4 h-96 overflow-y-auto'>
					{messages.map((msg) => (
						<div
							key={msg.id}
							className={`mb-2 flex ${
								msg.isUser ? "justify-end" : "justify-start"
							}`}
						>
							<div
								className={`px-4 py-2 rounded-lg ${
									msg.isUser
										? "bg-cyan-600 text-white"
										: "bg-gray-800 text-gray-100"
								}`}
							>
								<div>{msg.text}</div>
								{msg.ttsAudioUrl && (
									<audio
										src={msg.ttsAudioUrl}
										controls
										className='mt-2 w-full'
									/>
								)}
								<div className='text-xs text-gray-400 mt-1'>
									{msg.timestamp.toLocaleTimeString()}
								</div>
							</div>
						</div>
					))}
					<div ref={messagesEndRef} />
				</div>

				{/* Controls */}
				<div className='flex space-x-2'>
					<Input
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						onKeyDown={(e) => e.key === "Enter" && handleSendText()}
						placeholder='Type your message...'
						className='flex-1'
						disabled={isLoading || recording}
					/>

					<Button
						onClick={handleSendText}
						disabled={!inputValue.trim() || isLoading || recording}
					>
						Send
					</Button>

					{recording ? (
						<Button onClick={stopRecording} variant='destructive'>
							Stop
						</Button>
					) : (
						<Button onClick={startRecording} disabled={isLoading}>
							Record
						</Button>
					)}
				</div>
			</div>
		</div>
	);
};

export default ChatPage;

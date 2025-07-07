"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
	id: string;
	query: string;
	isUser: boolean;
	timestamp: Date;
}

const ChatPage = () => {
	const [messages, setMessages] = useState<Message[]>([]);
	const [inputValue, setInputValue] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const ws = useRef<WebSocket | null>(null);

	useEffect(() => {
		ws.current = new WebSocket("ws://localhost:8000/ws/chat");
		ws.current.onopen = () => {
			console.log("Connected to WebSocket");
		};
		ws.current.onmessage = (event) => {
			const aiMessage: Message = {
				id: Date.now().toString(),
				query: event.data,
				isUser: false,
				timestamp: new Date(),
			};
			setMessages((prev) => [...prev, aiMessage]);
			setIsLoading(false);
		};
		ws.current.onclose = () => {
			console.log("WebSocket connection closed");
		};
		return () => {
			ws.current?.close();
		};
	}, []);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const handleSendMessage = () => {
		if (!inputValue.trim() || !ws.current || ws.current.readyState !== 1)
			return;
		const userMessage: Message = {
			id: Date.now().toString(),
			query: inputValue,
			isUser: true,
			timestamp: new Date(),
		};
		setMessages((prev) => [...prev, userMessage]);
		setIsLoading(true);
		ws.current.send(inputValue);
		setInputValue("");
	};

	return (
		<div className='min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-black'>
			<div className='w-full max-w-2xl bg-black/40 rounded-lg shadow-lg p-6'>
				<div className='mb-4 h-96 overflow-y-auto'>
					{messages.map((message) => (
						<div
							key={message.id}
							className={`mb-2 flex ${
								message.isUser ? "justify-end" : "justify-start"
							}`}
						>
							<div
								className={`px-4 py-2 rounded-lg ${
									message.isUser
										? "bg-cyan-600 text-white"
										: "bg-gray-800 text-gray-100"
								}`}
							>
								{message.query}
								<div className='text-xs text-gray-400 mt-1'>
									{message.timestamp.toLocaleTimeString()}
								</div>
							</div>
						</div>
					))}
					<div ref={messagesEndRef} />
				</div>
				<div className='flex space-x-2'>
					<Input
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") handleSendMessage();
						}}
						placeholder='Type your message...'
						className='flex-1'
						disabled={isLoading}
					/>
					<Button
						onClick={handleSendMessage}
						disabled={!inputValue.trim() || isLoading}
					>
						Send
					</Button>
				</div>
			</div>
		</div>
	);
};

export default ChatPage;

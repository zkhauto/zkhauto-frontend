"use client";

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

export default function ChatWidget() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [messageStatus, setMessageStatus] = useState({});
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    
    const messageId = Date.now().toString();
    const userMsg = { 
      id: messageId,
      sender: "user", 
      text: input,
      status: "sending"
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setMessageStatus(prev => ({ ...prev, [messageId]: "sending" }));

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chat/chat`,
        { message: input },
        { withCredentials: true }
      );
      
      if (res.data) {
        setMessageStatus(prev => ({ ...prev, [messageId]: "sent" }));
        const botMsg = { 
          id: Date.now().toString(),
          sender: "bot", 
          text: res.data.reply,
          status: "sent"
        };
        setMessages((prev) => [...prev, botMsg]);
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message. Please try again.");
      setMessageStatus(prev => ({ ...prev, [messageId]: "error" }));
      setMessages((prev) => [
        ...prev,
        { 
          id: Date.now().toString(),
          sender: "system", 
          text: "Sorry, I'm having trouble connecting. Please try again later.",
          status: "error"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getMessageStatusIcon = (status) => {
    switch (status) {
      case "sending":
        return <Loader2 className="w-3 h-3 animate-spin" />;
      case "error":
        return <AlertCircle className="w-3 h-3 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
      >
        <MessageSquare className="w-6 h-6" />
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b">
            <h3 className="font-semibold">Car Support Chat</h3>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <MessageSquare className="w-12 h-12 mb-4" />
                <p>Start a conversation with our support team!</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-4 ${
                    msg.sender === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block p-3 rounded-lg ${
                      msg.sender === "user"
                        ? "bg-blue-500 text-white"
                        : msg.sender === "system"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {msg.text}
                      {msg.sender === "user" && getMessageStatusIcon(messageStatus[msg.id])}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-1"
                disabled={loading}
              />
              <Button 
                onClick={sendMessage} 
                className="bg-blue-600 hover:bg-blue-700"
                disabled={loading || !input.trim()}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Sparkles, Bot, User, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Hi there! 👋 I'm your AI Career Buddy powered by advanced AI. Ask me anything about careers, courses, scholarships, colleges, or your future! How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const getAIResponse = async (userMessage) => {
    const systemContext = `You are CareerPathAI, a friendly and encouraging AI career counselor for Indian students, especially those from rural areas. 

Your expertise includes:
- Career guidance for all fields (Engineering, Medical, Commerce, Arts, Science, Design, etc.)
- Course information (B.Tech, MBBS, CA, LLB, BBA, B.Sc, etc.)
- Indian entrance exams (JEE, NEET, CLAT, CAT, GATE, etc.)
- Scholarships (especially Karnataka state scholarships and national scholarships)
- College recommendations in India
- Salary expectations and career prospects
- Learning roadmaps and study tips

Guidelines:
1. Be warm, encouraging, and supportive - like a caring mentor
2. Use simple language that rural students can understand
3. Include specific details like salary ranges (in LPA), duration, top colleges
4. Mention relevant scholarships when discussing courses
5. Use emojis sparingly to be friendly 😊
6. For Karnataka students, mention Karnataka-specific scholarships like Vidyasiri, Arivu, SC/ST Post Matric, etc.
7. Always encourage students and remind them that they can achieve their dreams
8. Keep responses concise but informative (2-4 paragraphs max)
9. If asked about something outside career/education, politely redirect to career topics

Remember: You're talking to young students who may be the first in their family to pursue higher education. Be their guide and cheerleader!`;

    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `${systemContext}\n\nStudent's question: ${userMessage}\n\nProvide a helpful, encouraging response:`,
      response_json_schema: {
        type: "object",
        properties: {
          response: { type: "string", description: "Your helpful response to the student" }
        },
        required: ["response"]
      }
    });

    return response.response;
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage = {
      type: "user",
      text: inputValue,
      timestamp: new Date()
    };
    
    const currentInput = inputValue;
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const aiResponse = await getAIResponse(currentInput);
      const botMessage = {
        type: "bot",
        text: aiResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        type: "bot",
        text: "I'm sorry, I couldn't process that right now. Please try again! 😊",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickReplies = [
    "Best engineering colleges?",
    "How to become a doctor?",
    "Karnataka scholarships",
    "CA vs MBA salary",
    "Data Science career"
  ];

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-gray-50">
      {/* Fixed Header */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-4 py-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg">AI Career Buddy</h1>
            <p className="text-xs text-blue-100">Powered by AI • Ask anything about careers 🚀</p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                message.type === "user" 
                  ? "bg-gradient-to-br from-blue-500 to-green-500" 
                  : "bg-gradient-to-br from-purple-500 to-pink-500"
              }`}>
                {message.type === "user" ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>

              <div className={`max-w-[85%] sm:max-w-[75%] ${message.type === "user" ? "text-right" : "text-left"}`}>
                <div
                  className={`inline-block rounded-2xl px-4 py-3 ${
                    message.type === "user"
                      ? "bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-tr-sm"
                      : "bg-white text-gray-800 shadow-md border border-gray-100 rounded-tl-sm"
                  }`}
                >
                  <p className="whitespace-pre-line text-sm leading-relaxed">{message.text}</p>
                </div>
                <p className="text-xs text-gray-400 mt-1 px-1">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-md border border-gray-100">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                  <span className="text-sm text-gray-500">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Fixed Bottom Input */}
      <div className="bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-3">
          {/* Quick Replies */}
          <div className="flex flex-wrap gap-2 mb-3 overflow-x-auto pb-1">
            {quickReplies.map((reply, index) => (
              <button
                key={index}
                onClick={() => {
                  setInputValue(reply);
                  inputRef.current?.focus();
                }}
                disabled={isTyping}
                className="text-xs px-3 py-1.5 rounded-full bg-gray-100 hover:bg-blue-100 hover:text-blue-700 text-gray-700 transition-colors border border-gray-200 whitespace-nowrap disabled:opacity-50"
              >
                {reply}
              </button>
            ))}
          </div>

          {/* Input Row */}
          <div className="flex gap-3 items-center">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me about careers, courses, scholarships..."
              className="flex-1 rounded-full border-2 border-gray-200 px-4 py-3 text-sm focus:border-blue-400"
              disabled={isTyping}
            />
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              className="rounded-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 w-12 h-12 p-0"
            >
              {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </Button>
          </div>

          <p className="text-xs text-gray-400 mt-2 text-center">
            Press Enter to send • AI-powered responses for personalized guidance
          </p>
        </div>
      </div>
    </div>
  );
}

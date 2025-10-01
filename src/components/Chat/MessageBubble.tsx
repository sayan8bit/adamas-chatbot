// components/Chat/MessageBubble.tsx
import React from "react";
import { User, Bot } from "lucide-react";
import { Message } from "@/types/chatbot";

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = React.memo(
  ({ message }) => {
    const isUser = message.type === "user";
    const content = Array.isArray(message.content)
      ? message.content
      : [message.content];

    return (
      <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
        <div
          className={`flex space-x-4 max-w-4xl w-full ${
            isUser ? "flex-row-reverse space-x-reverse" : ""
          }`}
        >
          {/* Avatar */}
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
              isUser
                ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white"
                : "bg-gradient-to-br from-slate-800 to-slate-900 text-white"
            }`}
          >
            {isUser ? <User size={18} /> : <Bot size={18} />}
          </div>
          {/* Bubble */}
          <div
            className={`rounded-3xl p-5 shadow-xl backdrop-blur-sm border ${
              isUser
                ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-lg border-blue-500/20"
                : "bg-white/90 text-gray-800 rounded-bl-lg border-gray-200"
            }`}
          >
            <div className="space-y-2">
              {content.map((line, lineIndex) => (
                <div
                  key={lineIndex}
                  className={`${
                    line.startsWith("•")
                      ? "ml-3 text-sm"
                      : line.match(/^(📞|📧|📍|🕒|🎯|📋|🔧|💼|🎨|⚖️)/)
                      ? "font-semibold text-base mt-2"
                      : ""
                  } leading-relaxed whitespace-pre-wrap`}
                >
                  {line || <br />}
                </div>
              ))}
            </div>
            <div
              className={`text-xs mt-3 opacity-70 ${
                isUser ? "text-blue-100" : "text-gray-500"
              }`}
            >
              {message.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

MessageBubble.displayName = "MessageBubble";
export default MessageBubble;

// components/Chat/TypingIndicator.tsx
import React from "react";
import { Bot } from "lucide-react";

const TypingIndicator: React.FC = () => (
  <div className="flex justify-start">
    <div className="flex space-x-4 max-w-4xl">
      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 text-white flex items-center justify-center flex-shrink-0 shadow-lg">
        <Bot size={18} />
      </div>
      <div className="bg-white/90 shadow-xl rounded-3xl rounded-bl-lg p-5 border border-gray-200 backdrop-blur-sm">
        <div className="flex space-x-2">
          <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce"></div>
          <div
            className="w-2.5 h-2.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-2.5 h-2.5 bg-gradient-to-r from-pink-500 to-red-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
      </div>
    </div>
  </div>
);

export default TypingIndicator;

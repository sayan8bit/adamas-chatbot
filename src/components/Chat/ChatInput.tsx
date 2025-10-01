// components/Chat/ChatInput.tsx
import React from "react";
import { Send } from "lucide-react";
import { contactInfo, QUICK_ACTIONS } from "@/utils/constants";

interface ChatInputProps {
  inputMessage: string;
  isTyping: boolean;
  setInputMessage: (message: string) => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handleSendMessage: () => void;
  quickActionHandler: (text: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  inputMessage,
  isTyping,
  setInputMessage,
  handleKeyPress,
  handleSendMessage,
  quickActionHandler,
}) => (
  <div className="flex-shrink-0">
    {/* Quick Actions */}
    <div className="p-6 pt-0 flex space-x-3 overflow-x-auto">
      {QUICK_ACTIONS.map((action, index) => (
        <button
          key={index}
          onClick={() => quickActionHandler(action)}
          className="flex-shrink-0 px-4 py-2 text-sm font-medium text-blue-800 bg-white border border-blue-200 rounded-full shadow-md hover:bg-blue-100 transition-colors"
        >
          {action}
        </button>
      ))}
    </div>

    {/* Premium Input Area */}
    <div className="p-6 bg-white/90 backdrop-blur-sm border-t border-gray-200">
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <textarea
            value={inputMessage}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setInputMessage(e.target.value)
            }
            onKeyDown={handleKeyPress}
            placeholder="Ask me anything about Adamas University..."
            className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white/80 backdrop-blur-sm shadow-lg text-gray-800 placeholder-gray-500 transition-all duration-200"
            rows={1}
            style={{ minHeight: "56px", maxHeight: "120px" }}
          />
        </div>
        <button
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() || isTyping}
          className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100"
        >
          <Send size={22} />
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-3 text-center">
        For immediate assistance, call{" "}
        <span className="font-medium text-blue-600">{contactInfo.phone}</span>
      </p>
    </div>
  </div>
);

export default ChatInput;

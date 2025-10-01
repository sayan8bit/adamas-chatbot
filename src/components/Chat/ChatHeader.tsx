// components/Chat/ChatHeader.tsx
import React from "react";
import { Bot, Settings } from "lucide-react";

interface ChatHeaderProps {
  handleLogoClick: () => void;
  showAdminButton: boolean;
  showAdminPanel: boolean;
  setShowAdminPanel: (show: boolean) => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  handleLogoClick,
  showAdminButton,
  showAdminPanel,
  setShowAdminPanel,
}) => (
  <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white shadow-2xl flex-shrink-0">
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div
            className="w-16 h-16 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20 cursor-pointer hover:scale-105 transition-transform duration-200"
            onClick={handleLogoClick}
            title="Adamas University"
          >
            <Bot className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Adamas University
            </h1>
            <p className="text-blue-200 text-sm font-medium">
              Intelligent Assistant • Powered by Advanced AI
            </p>
          </div>
        </div>
        {showAdminButton && (
          <button
            onClick={() => setShowAdminPanel(!showAdminPanel)}
            className="p-3 hover:bg-white/10 rounded-xl transition-all duration-200 border border-white/20 backdrop-blur-sm shadow-md"
            title="Admin Panel"
          >
            <Settings className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  </div>
);

export default ChatHeader;

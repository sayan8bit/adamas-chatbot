// app/page.tsx - CORRECTED
"use client";

import React from "react";
import { useChatbot } from "@/hooks/useChatbot";
import MessageBubble from "@/components/Chat/MessageBubble";
import TypingIndicator from "@/components/Chat/TypingIndicator";
import ChatHeader from "@/components/Chat/ChatHeader";
import ChatInput from "@/components/Chat/ChatInput";
import CustomAlertModal from "@/components/UI/CustomAlertModal";
import AdminPanel from "@/components/Admin/AdminPanel"; // Ensure this is imported

const PremiumAdamasUniversityChatbot: React.FC = () => {
  // *** 1. CALL useChatbot() ONCE ***
  const chatbotProps = useChatbot();

  const {
    messages,
    isTyping,
    showAdminPanel,
    setShowAdminPanel,
    showAdminButton,
    messagesEndRef,
    alertState,
    closeCustomAlert,
    handleLogoClick,
    // Destructure all other props needed for ChatInput here, or just spread them below
    inputMessage,
    setInputMessage,
    handleKeyPress,
    quickActionHandler,
  } = chatbotProps; // Destructure from the single result

  return (
    <div className="max-w-7xl mx-auto h-screen flex bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-sans shadow-2xl rounded-xl overflow-hidden">
      <CustomAlertModal
        alertState={alertState}
        closeCustomAlert={closeCustomAlert}
      />

      {/* Main Chatbot Interface */}
      <div
        className={`${
          showAdminPanel ? "w-2/3 max-lg:w-full" : "w-full"
        } flex flex-col transition-all duration-500 ease-in-out`}
      >
        <ChatHeader
          handleLogoClick={handleLogoClick}
          showAdminButton={showAdminButton}
          showAdminPanel={showAdminPanel}
          setShowAdminPanel={setShowAdminPanel}
        />

        {/* Messages Area */}
        <div
          className="flex-1 overflow-y-auto p-6 space-y-6"
          style={{ scrollBehavior: "smooth" }}
        >
          {messages.map((message, index) => (
            <MessageBubble key={index} message={message} />
          ))}

          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <ChatInput
          inputMessage={inputMessage}
          isTyping={isTyping}
          setInputMessage={setInputMessage}
          handleKeyPress={handleKeyPress}
          handleSendMessage={chatbotProps.handleSendMessage}
          quickActionHandler={quickActionHandler}
        />
      </div>

      {/* Admin Panel */}
      <AdminPanel
        showAdminPanel={showAdminPanel}
        setShowAdminPanel={setShowAdminPanel}
        // *** 2. PASS THE SINGLE RESULT OBJECT ***
        chatbotProps={chatbotProps}
      />
    </div>
  );
};

export default PremiumAdamasUniversityChatbot;

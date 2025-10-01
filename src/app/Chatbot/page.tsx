"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Send,
  Bot,
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  GraduationCap,
  Settings,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Search,
  Shield,
  Eye,
  EyeOff,
  Info,
  AlertTriangle,
} from "lucide-react";

// --- TYPE DEFINITIONS ---

/** Defines the structure for a single chat message. */
interface Message {
  type: "user" | "bot";
  content: string | string[]; // Content can be a single string or an array of lines for formatted bot responses
  timestamp: Date;
}

/** Defines the structure for a single knowledge base entry. */
interface KnowledgeBaseEntry {
  keywords: string | string[];
  response: string | string[];
}

/** Defines the complete knowledge base map. */
interface KnowledgeBase {
  [category: string]: KnowledgeBaseEntry;
}

/** Defines the structure for the input fields in the Add/Edit form. */
interface KnowledgeEntryInput {
  category: string;
  keywords: string;
  response: string;
}

/** Defines the state for the custom alert/confirmation modal. */
interface AlertState {
  message: string;
  isConfirm: boolean;
  onConfirm?: () => void;
  isVisible: boolean;
}

const PremiumAdamasUniversityChatbot: React.FC = () => {
  // --- STATE HOOKS ---
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [showAdminPanel, setShowAdminPanel] = useState<boolean>(false);
  const [adminPassword, setAdminPassword] = useState<string>("");
  const [isAdminAuthenticated, setIsAdminAuthenticated] =
    useState<boolean>(false);
  const [showAdminButton, setShowAdminButton] = useState<boolean>(false);
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBase>({});
  const [editingEntry, setEditingEntry] = useState<
    (KnowledgeEntryInput & { originalCategory: string }) | null
  >(null);
  const [newEntry, setNewEntry] = useState<KnowledgeEntryInput>({
    category: "",
    keywords: "",
    response: "",
  });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [clickSequence, setClickSequence] = useState<number[]>([]);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [alertState, setAlertState] = useState<AlertState>({
    message: "",
    isConfirm: false,
    isVisible: false,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const adminPanelRef = useRef<HTMLDivElement>(null);

  // --- CONSTANTS ---
  const ADMIN_PASS = "adamas2024admin";
  const contactInfo = {
    phone: "+91-33-2559-5000",
    email: "info@adamasuniversity.ac.in",
    address: "Barasat-Barrackpore Road, Kolkata - 700126",
    hours: "9:00 AM - 5:00 PM (Mon-Sat)",
  };

  const fallbackResponse: string[] = [
    "I apologize, but I don't have specific information about your query in my current knowledge base.",
    "",
    "For accurate and detailed information, please contact Adamas University directly:",
    `📞 Phone: ${contactInfo.phone}`,
    `📧 Email: ${contactInfo.email}`,
    `📍 Address: ${contactInfo.address}`,
    `🕒 Office Hours: ${contactInfo.hours}`,
    "",
    "Our admission counselors will be happy to assist you with personalized information!",
  ];

  // --- UTILITY FUNCTIONS ---

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const showCustomAlert = (
    message: string,
    isConfirm: boolean = false,
    onConfirm?: () => void
  ) => {
    setAlertState({
      message,
      isConfirm,
      onConfirm,
      isVisible: true,
    });
    // Auto-hide alert if it's not a confirmation
    if (!isConfirm) {
      setTimeout(
        () => setAlertState((prev) => ({ ...prev, isVisible: false })),
        4000
      );
    }
  };

  const closeCustomAlert = () => {
    setAlertState({ message: "", isConfirm: false, isVisible: false });
  };

  /** Enhanced intent recognition based on keyword matching. */
  const recognizeIntent = useCallback(
    (message: string): string | null => {
      const lowerMessage = message.toLowerCase();
      let bestMatch: string | null = null;
      let maxScore: number = 0;

      Object.entries(knowledgeBase).forEach(([category, data]) => {
        let score = 0;
        const keywords = Array.isArray(data.keywords)
          ? data.keywords.map((k: string) => k.trim().toLowerCase())
          : data.keywords.split(",").map((k: string) => k.trim().toLowerCase());

        keywords.forEach((keyword) => {
          if (lowerMessage.includes(keyword)) {
            // Score by the length of the keyword (longer match = better score)
            score += keyword.split(" ").length;
          }
        });

        if (score > maxScore) {
          maxScore = score;
          bestMatch = category;
        }
      });

      // Require a minimum score to prevent matching single letters or common stopwords
      return maxScore > 1 ? bestMatch : null;
    },
    [knowledgeBase]
  );

  const generateResponse = useCallback(
    (intent: string | null): string[] => {
      if (!intent || !knowledgeBase[intent]) {
        return fallbackResponse;
      }

      const response = knowledgeBase[intent].response;
      return Array.isArray(response) ? response : [response as string];
    },
    [knowledgeBase]
  );

  // --- EVENT HANDLERS ---

  const handleLogoClick = () => {
    const newSequence: number[] = [...clickSequence, Date.now()];
    const recentClicks = newSequence.filter((time) => Date.now() - time < 3000);

    if (recentClicks.length >= 5) {
      setShowAdminButton(true);
      setClickSequence([]);
      // showCustomAlert("Admin access enabled! Click the settings icon.", false);
    } else {
      setClickSequence(recentClicks);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage: string = inputMessage.trim();
    setInputMessage("");

    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        content: userMessage,
        timestamp: new Date(),
      },
    ]);

    setIsTyping(true);

    setTimeout(() => {
      const intent: string | null = recognizeIntent(userMessage);
      const response: string[] = generateResponse(intent);

      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content: response,
          timestamp: new Date(),
        },
      ]);

      setIsTyping(false);
    }, 1200);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // --- ADMIN PANEL FUNCTIONS ---

  const handleAdminLogin = () => {
    if (adminPassword === ADMIN_PASS) {
      setIsAdminAuthenticated(true);
      setAdminPassword("");
      showCustomAlert("Authentication successful! Welcome, Admin.", false);
    } else {
      showCustomAlert("Invalid admin credentials.", false);
    }
  };

  const handleAddEntry = () => {
    if (!newEntry.category || !newEntry.keywords || !newEntry.response) {
      showCustomAlert(
        "Please fill all fields (Category, Keywords, and Response).",
        false
      );
      return;
    }

    const categoryKey = newEntry.category.toLowerCase().replace(/\s/g, "-");

    if (knowledgeBase[categoryKey]) {
      showCustomAlert(
        `Category '${categoryKey}' already exists. Please use 'Edit' or choose a different name.`,
        false
      );
      return;
    }

    const updatedKB: KnowledgeBase = {
      ...knowledgeBase,
      [categoryKey]: {
        keywords: newEntry.keywords
          .split(",")
          .map((k) => k.trim())
          .filter((k) => k.length > 0),
        response: newEntry.response.split("\n"),
      },
    };

    setKnowledgeBase(updatedKB);
    setNewEntry({ category: "", keywords: "", response: "" });
    showCustomAlert(`New entry '${categoryKey}' added successfully.`, false);
  };

  const handleEditEntry = (category: string) => {
    const entry = knowledgeBase[category];
    if (!entry) return;

    const keywordsStr = Array.isArray(entry.keywords)
      ? entry.keywords.join(", ")
      : entry.keywords;
    const responseStr = Array.isArray(entry.response)
      ? entry.response.join("\n")
      : entry.response;

    setEditingEntry({
      originalCategory: category,
      category: category,
      keywords: keywordsStr,
      response: responseStr,
    });
  };

  const handleUpdateEntry = () => {
    if (!editingEntry || !editingEntry.keywords || !editingEntry.response) {
      showCustomAlert("Keywords and Response cannot be empty.", false);
      return;
    }

    const newCategoryKey = editingEntry.category
      .toLowerCase()
      .replace(/\s/g, "-");
    const updatedKB: KnowledgeBase = { ...knowledgeBase };

    // Handle category key change (delete old, add new)
    if (editingEntry.originalCategory !== newCategoryKey) {
      delete updatedKB[editingEntry.originalCategory];
    }

    updatedKB[newCategoryKey] = {
      keywords: editingEntry.keywords
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k.length > 0),
      response: editingEntry.response.split("\n"),
    };

    setKnowledgeBase(updatedKB);
    setEditingEntry(null);
    showCustomAlert(`Entry '${newCategoryKey}' updated successfully.`, false);
  };

  const handleDeleteEntry = (category: string) => {
    showCustomAlert(
      `Are you sure you want to permanently delete the knowledge entry: "${category}"?`,
      true,
      () => {
        const updatedKB: KnowledgeBase = { ...knowledgeBase };
        delete updatedKB[category];
        setKnowledgeBase(updatedKB);
        closeCustomAlert();
        showCustomAlert(`Entry '${category}' deleted.`, false);
      }
    );
  };

  // --- USE EFFECTS ---

  // Initialize with default knowledge base
  useEffect(() => {
    const defaultKnowledgeBase: KnowledgeBase = {
      greeting: {
        keywords: [
          "hello",
          "hi",
          "hey",
          "start",
          "help",
          "good morning",
          "good afternoon",
          "good evening",
        ],
        response: [
          "Welcome to Adamas University! 🎓",
          "",
          "I'm your intelligent assistant, here to help you discover everything about our prestigious institution.",
          "",
          "I can provide information about:",
          "• Admission procedures and eligibility criteria",
          "• Comprehensive course catalog and specializations",
          "• Fee structure and scholarship opportunities",
          "• World-class campus facilities and amenities",
          "• Industry partnerships and placement records",
          "• Student life and extracurricular activities",
          "",
          "How may I assist you today?",
        ],
      },
      admission: {
        keywords: [
          "admission",
          "apply",
          "application",
          "eligibility",
          "entrance",
          "how to apply",
          "requirements",
          "documents",
          "process",
        ],
        response: [
          "Adamas University Admission Process:",
          "",
          "🎯 Application Steps:",
          "• Complete online application form",
          "• Submit required academic documents",
          "• Appear for program-specific entrance examination (if required)",
          "• Attend counseling session (if shortlisted)",
          "• Final admission based on merit and availability",
          "",
          "📋 General Eligibility: Varies by program (10+2 for UG, Graduate degree for PG) with minimum percentage requirements.",
          "",
          `📞 For personalized guidance: ${contactInfo.phone}`,
          `📧 Email: ${contactInfo.email}`,
        ],
      },
      courses: {
        keywords: [
          "courses",
          "programs",
          "degree",
          "btech",
          "mtech",
          "bba",
          "mba",
          "subjects",
          "stream",
          "engineering",
          "management",
          "curriculum",
          "bachelor",
          "master",
        ],
        response: [
          "🎓 Academic Programs at Adamas University:",
          "",
          "🔧 Engineering & Technology: B.Tech (CSE, ECE, ME, CE, EE, IT), M.Tech (Specialized branches)",
          "",
          "💼 Management & Commerce: BBA, MBA with multiple specializations, Integrated programs",
          "",
          "🎨 Liberal Arts & Sciences: BA, MA, B.Sc, M.Sc in various disciplines",
          "",
          "⚖️ Professional Programs: Law (LLB, LLM), Pharmacy (B.Pharm, M.Pharm), Architecture",
          "",
          `For detailed curriculum and admission criteria: ${contactInfo.phone}`,
        ],
      },
      contact: {
        keywords: [
          "contact",
          "phone",
          "email",
          "address",
          "location",
          "reach",
          "visit",
          "directions",
        ],
        response: [
          "📍 Contact Adamas University:",
          "",
          `📞 Main Office: ${contactInfo.phone}`,
          `📧 General Inquiries: ${contactInfo.email}`,
          `🏛️ Campus Address: ${contactInfo.address}`,
          `🕒 Office Hours: ${contactInfo.hours}`,
          "",
          "🚗 How to Reach: Well-connected by road and rail. Nearest railway station: Barasat.",
          "",
          "Our team is always ready to assist you!",
        ],
      },
    };
    setKnowledgeBase(defaultKnowledgeBase);
  }, []);

  // Initialize with welcome message (after KB is set)
  useEffect(() => {
    if (Object.keys(knowledgeBase).length > 0 && messages.length === 0) {
      setMessages([
        {
          type: "bot",
          content: knowledgeBase.greeting.response,
          timestamp: new Date(),
        },
      ]);
    }
  }, [knowledgeBase]);

  // Scroll to bottom on new message
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Filtered entries for Admin Search
  const filteredEntries = Object.entries(knowledgeBase).filter(([category]) =>
    category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const quickActionHandler = (text: string) => {
    setInputMessage(text);
    // Automatically send the message after a small delay to allow the state update
    setTimeout(handleSendMessage, 50);
  };

  // --- RENDER HELPERS (Memoized to prevent re-renders) ---

  const MessageBubble: React.FC<{ message: Message }> = React.memo(
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
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                isUser
                  ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white"
                  : "bg-gradient-to-br from-slate-800 to-slate-900 text-white"
              }`}
            >
              {isUser ? <User size={18} /> : <Bot size={18} />}
            </div>
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

  const CustomAlertModal: React.FC = React.memo(() => {
    if (!alertState.isVisible) return null;

    const Icon = alertState.isConfirm ? AlertTriangle : Info;
    const colorClass = alertState.isConfirm ? "bg-red-500" : "bg-blue-500";

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
        <div
          ref={adminPanelRef}
          className="bg-white rounded-xl shadow-2xl max-w-sm w-full transform transition-all duration-300 scale-100"
        >
          <div
            className="flex items-center p-4 rounded-t-xl text-white"
            style={{ background: colorClass }}
          >
            <Icon size={24} className="mr-3" />
            <h3 className="font-bold">
              {alertState.isConfirm ? "Confirmation Required" : "Notification"}
            </h3>
          </div>
          <div className="p-6">
            <p className="text-gray-700 mb-6">{alertState.message}</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeCustomAlert}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {alertState.isConfirm ? "Cancel" : "Close"}
              </button>
              {alertState.isConfirm && (
                <button
                  onClick={alertState.onConfirm}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-md"
                >
                  Confirm Delete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className="max-w-7xl mx-auto h-screen flex bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-sans shadow-2xl rounded-xl overflow-hidden">
      <CustomAlertModal />
      {/* Main Chatbot Interface */}
      <div
        className={`${
          showAdminPanel ? "w-2/3 max-lg:w-full" : "w-full"
        } flex flex-col transition-all duration-500 ease-in-out`}
      >
        {/* Premium Header */}
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

        {/* Premium Messages Area */}
        <div
          className="flex-1 overflow-y-auto p-6 space-y-6"
          style={{ scrollBehavior: "smooth" }}
        >
          {messages.map((message, index) => (
            <MessageBubble key={index} message={message} />
          ))}

          {isTyping && (
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
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions (Optional, but good for UX) */}
        <div className="p-6 pt-0 flex space-x-3 overflow-x-auto">
          {[
            "Admission Process",
            "Available Courses",
            "Contact Information",
            "Scholarships",
          ].map((action, index) => (
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
        <div className="p-6 bg-white/90 backdrop-blur-sm border-t border-gray-200 flex-shrink-0">
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
            <span className="font-medium text-blue-600">
              {contactInfo.phone}
            </span>
          </p>
        </div>
      </div>

      {/* Premium Admin Panel */}
      {showAdminPanel && (
        <div className="w-1/3 max-lg:absolute max-lg:top-0 max-lg:right-0 max-lg:h-full max-lg:z-40 bg-white shadow-2xl flex flex-col border-l border-gray-200 transition-all duration-500">
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-6 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="w-6 h-6 text-blue-400" />
                <h2 className="text-xl font-bold">Admin Panel</h2>
              </div>
              <button
                onClick={() => setShowAdminPanel(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Close Panel"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {!isAdminAuthenticated ? (
            <div className="p-6 flex-1 flex items-center justify-center">
              <div className="space-y-6 w-full max-w-sm">
                <div className="text-center">
                  <Shield className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Admin Authentication
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Enter your admin credentials to manage the knowledge base.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="admin-pass"
                    className="block text-sm font-medium mb-2 text-gray-700"
                  >
                    Admin Password
                  </label>
                  <div className="relative">
                    <input
                      id="admin-pass"
                      type={showPassword ? "text" : "password"}
                      value={adminPassword}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setAdminPassword(e.target.value)
                      }
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                      placeholder="Enter admin password"
                      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                        e.key === "Enter" && handleAdminLogin()
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAdminLogin}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Authenticate
                </button>

                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    (Hint: Click the logo 5 times to reveal the admin button.)
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Password:{" "}
                    <span className="font-mono text-gray-600 select-all">
                      {ADMIN_PASS}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              {/* Add New Entry */}
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50 flex-shrink-0">
                <h3 className="font-bold mb-4 flex items-center text-gray-800">
                  <Plus size={18} className="mr-2 text-green-600" />
                  Add Knowledge Entry
                </h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Category (e.g., fees, scholarships-2024)"
                    value={newEntry.category}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewEntry({ ...newEntry, category: e.target.value })
                    }
                    className="w-full p-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Keywords (comma separated, e.g., fee structure, how much is the fee)"
                    value={newEntry.keywords}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewEntry({ ...newEntry, keywords: e.target.value })
                    }
                    className="w-full p-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <textarea
                    placeholder="Response (use line breaks for list formatting)"
                    value={newEntry.response}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setNewEntry({ ...newEntry, response: e.target.value })
                    }
                    className="w-full p-3 border-2 border-gray-200 rounded-xl text-sm h-24 resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleAddEntry}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white p-3 rounded-xl text-sm font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg"
                  >
                    Add Entry
                  </button>
                </div>
              </div>

              {/* Search */}
              <div className="p-6 border-b border-gray-200 bg-blue-50 flex-shrink-0">
                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search entries by category..."
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setSearchTerm(e.target.value)
                    }
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Existing Entries */}
              <div className="p-6">
                <h3 className="font-bold mb-4 text-gray-800 flex items-center">
                  <Bot size={18} className="mr-2 text-blue-600" />
                  Knowledge Base ({Object.keys(knowledgeBase).length} entries)
                </h3>
                <div className="space-y-4">
                  {filteredEntries.map(([category, data]) => (
                    <div
                      key={category}
                      className="border-2 border-gray-100 rounded-xl p-4 bg-gradient-to-r from-white to-gray-50 hover:shadow-lg transition-shadow duration-200"
                    >
                      {editingEntry?.originalCategory === category ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            placeholder="Category Key"
                            value={editingEntry.category}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                              setEditingEntry({
                                ...editingEntry,
                                category: e.target.value,
                              })
                            }
                            className="w-full p-3 border-2 border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <input
                            type="text"
                            placeholder="Keywords (comma separated)"
                            value={editingEntry.keywords}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                              setEditingEntry({
                                ...editingEntry,
                                keywords: e.target.value,
                              })
                            }
                            className="w-full p-3 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <textarea
                            placeholder="Response (use line breaks)"
                            value={editingEntry.response}
                            onChange={(
                              e: React.ChangeEvent<HTMLTextAreaElement>
                            ) =>
                              setEditingEntry({
                                ...editingEntry,
                                response: e.target.value,
                              })
                            }
                            className="w-full p-3 border-2 border-gray-200 rounded-lg text-sm h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={handleUpdateEntry}
                              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white p-2 rounded-lg text-sm font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center shadow-md"
                            >
                              <Save size={16} className="mr-1" />
                              Save Changes
                            </button>
                            <button
                              onClick={() => setEditingEntry(null)}
                              className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white p-2 rounded-lg text-sm font-medium hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-md"
                            >
                              <X size={16} className="mr-1" />
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-gray-800 capitalize flex items-center text-lg">
                              <span className="w-2.5 h-2.5 bg-blue-500 rounded-full mr-2"></span>
                              {category}
                            </h4>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditEntry(category)}
                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                                title="Edit"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteEntry(category)}
                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <p className="text-xs text-gray-600 font-medium break-all">
                              <span className="bg-gray-100 px-2 py-1 rounded-full inline-block mr-2">
                                Keywords:
                              </span>{" "}
                              {Array.isArray(data.keywords)
                                ? data.keywords.join(", ")
                                : data.keywords}
                            </p>
                            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border-l-4 border-blue-500 max-h-24 overflow-hidden">
                              {Array.isArray(data.response)
                                ? data.response.filter(
                                    (l) => l.trim() !== ""
                                  )[0] + (data.response.length > 1 ? "..." : "")
                                : data.response.substring(0, 100) +
                                  (data.response.length > 100 ? "..." : "")}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  ))}

                  {filteredEntries.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Search size={48} className="mx-auto mb-3 opacity-50" />
                      <p>No entries found matching your search.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PremiumAdamasUniversityChatbot;

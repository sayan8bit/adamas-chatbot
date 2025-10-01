// hooks/useChatbot.ts
import { useState, useEffect, useRef, useCallback } from "react";
import {
  Message,
  KnowledgeBase,
  KnowledgeEntryInput,
  AlertState,
  EditingEntry,
} from "@/types/chatbot";
import {
  ADMIN_PASS,
  defaultKnowledgeBase,
  fallbackResponse,
} from "@/utils/constants";

export const useChatbot = () => {
  // --- STATE HOOKS ---
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [showAdminPanel, setShowAdminPanel] = useState<boolean>(false);
  const [adminPassword, setAdminPassword] = useState<string>("");
  const [isAdminAuthenticated, setIsAdminAuthenticated] =
    useState<boolean>(false);
  const [showAdminButton, setShowAdminButton] = useState<boolean>(false);
  const [knowledgeBase, setKnowledgeBase] =
    useState<KnowledgeBase>(defaultKnowledgeBase);
  const [editingEntry, setEditingEntry] = useState<EditingEntry | null>(null);
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

  // --- UTILITY FUNCTIONS (ALERT & SCROLL) ---

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const closeCustomAlert = () => {
    setAlertState({ message: "", isConfirm: false, isVisible: false });
  };

  const showCustomAlert = (
    message: string,
    isConfirm: boolean = false,
    onConfirm?: () => void
  ) => {
    setAlertState({
      message,
      isConfirm,
      onConfirm: isConfirm ? onConfirm : undefined,
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

  // --- BOT LOGIC ---

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
          : (data.keywords as string)
              .split(",")
              .map((k: string) => k.trim().toLowerCase());

        keywords.forEach((keyword) => {
          if (lowerMessage.includes(keyword) && keyword.length > 1) {
            // Score by the length of the keyword (longer match = better score)
            score += keyword.split(" ").length;
          }
        });

        if (score > maxScore) {
          maxScore = score;
          bestMatch = category;
        }
      });

      // Require a minimum score
      return maxScore > 0 ? bestMatch : null;
    },
    [knowledgeBase] // *** DEPENDENCY ADDED: knowledgeBase ***
  );

  const generateResponse = useCallback(
    (intent: string | null): string[] => {
      if (!intent || !knowledgeBase[intent]) {
        return fallbackResponse;
      }

      const response = knowledgeBase[intent].response;
      return Array.isArray(response) ? response : [response as string];
    },
    [knowledgeBase] // *** DEPENDENCY ADDED: knowledgeBase ***
  );

  // --- CHAT HANDLERS ---

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

    // Call intent recognition using the current closure/memoized function
    const intent: string | null = recognizeIntent(userMessage);

    // Defer bot response slightly for a better UX
    setTimeout(() => {
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

  const quickActionHandler = (text: string) => {
    setInputMessage(text);
    // Automatically send the message after a small delay to allow the state update
    setTimeout(handleSendMessage, 50);
  };

  // --- ADMIN HANDLERS ---

  const handleLogoClick = () => {
    const newSequence: number[] = [...clickSequence, Date.now()];
    const recentClicks = newSequence.filter((time) => Date.now() - time < 3000);

    if (recentClicks.length >= 5) {
      setShowAdminButton(true);
      setClickSequence([]);
    } else {
      setClickSequence(recentClicks);
    }
  };

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

  // Scroll to bottom on new message
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Initial welcome message (Only runs once, but uses defaultKnowledgeBase from constants)
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          type: "bot",
          content: defaultKnowledgeBase.greeting.response,
          timestamp: new Date(),
        },
      ]);
    }
  }, []);

  // Filtered entries for Admin Search
  const filteredEntries = Object.entries(knowledgeBase).filter(([category]) =>
    category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    // State
    messages,
    inputMessage,
    isTyping,
    showAdminPanel,
    adminPassword,
    isAdminAuthenticated,
    showAdminButton,
    knowledgeBase,
    editingEntry,
    newEntry,
    searchTerm,
    showPassword,
    alertState,
    messagesEndRef,
    adminPanelRef,
    // Setters
    setInputMessage,
    setShowAdminPanel,
    setAdminPassword,
    setShowPassword,
    setNewEntry,
    setEditingEntry,
    setSearchTerm,
    // Handlers
    handleSendMessage,
    handleKeyPress,
    quickActionHandler,
    handleLogoClick,
    handleAdminLogin,
    handleAddEntry,
    handleEditEntry,
    handleUpdateEntry,
    handleDeleteEntry,
    closeCustomAlert,
    // Computed
    filteredEntries,
  };
};

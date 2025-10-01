// components/Admin/AdminPanel.tsx - CORRECTED

// Import the hook's return type for cleaner type definition
import { useChatbot } from "@/hooks/useChatbot";
import AdminAuth from "./AdminAuth";
import KnowledgeEntryForm from "./KnowledgeEntryForm";
import KnowledgeBaseList from "./KnowledgeBaseList";
import { Shield, X } from "lucide-react";

interface AdminPanelProps {
  showAdminPanel: boolean;
  setShowAdminPanel: (show: boolean) => void;
  // *** CHANGE PROP NAME AND TYPE HERE ***
  chatbotProps: ReturnType<typeof useChatbot>;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  showAdminPanel,
  setShowAdminPanel,
  // Rename prop from 'useChatbotProps' to 'chatbotProps' (optional, but cleaner)
  chatbotProps,
}) => {
  const {
    isAdminAuthenticated,
    adminPassword,
    showPassword,
    setAdminPassword,
    setShowPassword,
    handleAdminLogin,
    newEntry,
    setNewEntry,
    handleAddEntry,
    searchTerm,
    setSearchTerm,
    knowledgeBase,
    filteredEntries,
    editingEntry,
    setEditingEntry,
    handleEditEntry,
    handleUpdateEntry,
    handleDeleteEntry,
    // Make sure to pull *all* necessary props/handlers from the object
  } = chatbotProps; // *** Destructure from the passed prop ***

  if (!showAdminPanel) return null;

  return (
    <div className="text-black w-1/3 max-lg:absolute max-lg:top-0 max-lg:right-0 max-lg:h-full max-lg:z-40 bg-white shadow-2xl flex flex-col border-l border-gray-200 transition-all duration-500">
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
        <AdminAuth
          adminPassword={adminPassword}
          showPassword={showPassword}
          setAdminPassword={setAdminPassword}
          setShowPassword={setShowPassword}
          handleAdminLogin={handleAdminLogin}
        />
      ) : (
        <>
          <KnowledgeEntryForm
            newEntry={newEntry}
            setNewEntry={setNewEntry}
            handleAddEntry={handleAddEntry}
          />
          <KnowledgeBaseList
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            knowledgeBase={knowledgeBase}
            filteredEntries={filteredEntries}
            editingEntry={editingEntry}
            setEditingEntry={setEditingEntry}
            handleEditEntry={handleEditEntry}
            handleUpdateEntry={handleUpdateEntry}
            handleDeleteEntry={handleDeleteEntry}
          />
        </>
      )}
    </div>
  );
};

export default AdminPanel;

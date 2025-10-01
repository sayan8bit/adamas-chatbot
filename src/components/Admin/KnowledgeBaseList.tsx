// components/Admin/KnowledgeBaseList.tsx
import React from "react";
import { Search, Bot, Edit, Trash2, Save, X } from "lucide-react";
import { KnowledgeBase, EditingEntry } from "@/types/chatbot";

interface KnowledgeBaseListProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  knowledgeBase: KnowledgeBase;
  filteredEntries: [string, KnowledgeBase[string]][];
  editingEntry: EditingEntry | null;
  setEditingEntry: (entry: EditingEntry | null) => void;
  handleEditEntry: (category: string) => void;
  handleUpdateEntry: () => void;
  handleDeleteEntry: (category: string) => void;
}

const KnowledgeBaseList: React.FC<KnowledgeBaseListProps> = ({
  searchTerm,
  setSearchTerm,
  knowledgeBase,
  filteredEntries,
  editingEntry,
  setEditingEntry,
  handleEditEntry,
  handleUpdateEntry,
  handleDeleteEntry,
}) => (
  <div className="flex-1 overflow-y-auto">
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
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
                    className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white p-2 rounded-lg text-sm font-medium hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-md flex items-center justify-center"
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
                      ? data.response.filter((l) => l.trim() !== "")[0] +
                        (data.response.length > 1 ? "..." : "")
                      : (data.response as string).substring(0, 100) +
                        ((data.response as string).length > 100 ? "..." : "")}
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
);

export default KnowledgeBaseList;

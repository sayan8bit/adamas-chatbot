// components/Admin/KnowledgeEntryForm.tsx
import React from "react";
import { Plus } from "lucide-react";
import { KnowledgeEntryInput } from "@/types/chatbot";

interface KnowledgeEntryFormProps {
  newEntry: KnowledgeEntryInput;
  setNewEntry: (entry: KnowledgeEntryInput) => void;
  handleAddEntry: () => void;
}

const KnowledgeEntryForm: React.FC<KnowledgeEntryFormProps> = ({
  newEntry,
  setNewEntry,
  handleAddEntry,
}) => (
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
);

export default KnowledgeEntryForm;

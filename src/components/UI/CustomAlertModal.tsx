// components/UI/CustomAlertModal.tsx
import React from "react";
import { AlertTriangle, Info, X } from "lucide-react";
import { AlertState } from "@/types/chatbot";

interface CustomAlertModalProps {
  alertState: AlertState;
  closeCustomAlert: () => void;
}

const CustomAlertModal: React.FC<CustomAlertModalProps> = React.memo(
  ({ alertState, closeCustomAlert }) => {
    if (!alertState.isVisible) return null;

    const Icon = alertState.isConfirm ? AlertTriangle : Info;
    const colorClass = alertState.isConfirm ? "bg-red-500" : "bg-blue-500";

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full transform transition-all duration-300 scale-100">
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
  }
);

CustomAlertModal.displayName = "CustomAlertModal";
export default CustomAlertModal;

// components/Admin/AdminAuth.tsx
import React from "react";
import { Shield, Eye, EyeOff } from "lucide-react";
import { ADMIN_PASS } from "@/utils/constants";

interface AdminAuthProps {
  adminPassword: string;
  showPassword: boolean;
  setAdminPassword: (password: string) => void;
  setShowPassword: (show: boolean) => void;
  handleAdminLogin: () => void;
}

const AdminAuth: React.FC<AdminAuthProps> = ({
  adminPassword,
  showPassword,
  setAdminPassword,
  setShowPassword,
  handleAdminLogin,
}) => (
  <div className="p-6 flex-1 flex items-center justify-center text-black">
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
);

export default AdminAuth;

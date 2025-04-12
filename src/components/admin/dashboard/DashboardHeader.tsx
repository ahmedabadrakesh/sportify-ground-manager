
import React from "react";
import { User } from "@/types/models";

interface DashboardHeaderProps {
  user: User | null;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user }) => {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
      <p className="text-gray-600">
        Welcome back, {user?.name}! Here's what's happening with your grounds.
      </p>
    </div>
  );
};

export default DashboardHeader;

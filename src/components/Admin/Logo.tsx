import React from "react";

export const AdminLogo: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
        <span className="text-white font-bold text-sm">DPH</span>
      </div>
      <span className="font-semibold text-foreground">DPH Admin</span>
    </div>
  );
};

export default AdminLogo;

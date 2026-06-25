"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Role = "HR" | "Manager" | "Employee";

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>("HR");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedRole = localStorage.getItem("hrms_demo_role") as Role;
    if (storedRole && ["HR", "Manager", "Employee"].includes(storedRole)) {
      setRoleState(storedRole);
    }
  }, []);

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    localStorage.setItem("hrms_demo_role", newRole);
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null;
  }

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}

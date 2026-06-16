"use client";

import { useCallback, useEffect, useState } from "react";
import { isAdminAuthenticated, logoutAdmin, refreshAdminSession } from "@/features/admin/api/admin-api";
import { AdminDashboard } from "@/features/admin/components/AdminDashboard";
import { AdminGatePage } from "@/features/admin/components/AdminGatePage";

export function AdminHomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const syncAdminSession = useCallback(() => {
    if (!isAdminAuthenticated()) {
      setIsAuthenticated(false);
      return;
    }

    setIsAuthenticated(true);
    refreshAdminSession()
      .then(() => setIsAuthenticated(true))
      .catch(() => {
        setIsAuthenticated(isAdminAuthenticated());
      });
  }, []);

  useEffect(() => {
    syncAdminSession();

    window.addEventListener("pageshow", syncAdminSession);

    return () => {
      window.removeEventListener("pageshow", syncAdminSession);
    };
  }, [syncAdminSession]);

  if (isAuthenticated === null) {
    return <div className="min-h-screen bg-[#f3f0ea]" />;
  }

  if (!isAuthenticated) {
    return <AdminGatePage onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <AdminDashboard
      onLogout={() => {
        logoutAdmin();
        setIsAuthenticated(false);
      }}
    />
  );
}

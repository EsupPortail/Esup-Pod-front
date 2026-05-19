import { useAuth } from "@/src/context/AuthProvider";

export function useIsStaff() {
  const { user, isInitializing, isAuthenticated } = useAuth();

  return {
    isStaff: Boolean(user?.is_staff),
    isInitializing,
    isAuthenticated,
  };
}

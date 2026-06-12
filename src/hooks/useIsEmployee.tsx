import { useAuth } from "@/src/context/AuthProvider";

export function useIsEmployee() {
  const { user, isInitializing, isAuthenticated } = useAuth();

  return {
    isEmployee: Boolean(user?.affiliation === "employee"),
    isInitializing,
    isAuthenticated,
  };
}

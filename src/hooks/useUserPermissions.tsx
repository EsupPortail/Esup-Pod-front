import { useAuth } from "@/src/context/AuthProvider";

export function useUserPermissions() {
  const { user, isInitializing, isAuthenticated } = useAuth();

  return {
    isStaff: Boolean(user?.is_staff),
    isSuperUser: Boolean(user?.is_superuser),
    isEmployee: Boolean(user?.affiliation === "employee"),
    isInitializing,
    isAuthenticated,
  };
}

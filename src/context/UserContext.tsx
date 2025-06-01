// contexts/user-context.tsx
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/actions/user.action";
import { toast } from "sonner";

const UserContext = createContext<any>(null);

export function UserProvider({
  children,
  preloadedUser = null,
}: {
  children: React.ReactNode;
  preloadedUser?: any;
}) {
  const [user, setUser] = useState<any>(preloadedUser);
  const [loading, setLoading] = useState(!preloadedUser);
  // console.log("user", user);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);

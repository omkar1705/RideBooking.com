// src/hooks/useAuth.js
import { useState, useEffect } from "react";
import supabase from "../supabaseClient";

export const useAuth = () => {
  const [user, setUser] = useState(null);

  const checkAuth = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        return false;
      }

      setUser({
        ...session.user,
        role: session.user.user_metadata?.role,
      });

      return true;
    } catch (error) {
      console.error("Auth check error:", error);
      return false;
    }
  };

  useEffect(() => {
    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setUser({
          ...session.user,
          role: session.user.user_metadata?.role,
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, checkAuth };
};

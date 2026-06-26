import { defineStore } from "pinia";
import { supabase } from "../core/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as User | null,
    authError: "" as string,
    isLoading: false,
  }),
  actions: {
    async initAuth() {
      this.isLoading = true;
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.warn("Supabase auth init error:", error);
      }
      this.user = data.user;
      this.isLoading = false;
    },
    async signIn(email: string, password: string) {
      this.authError = "";
      this.isLoading = true;

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      this.isLoading = false;
      if (error) {
        this.authError = error.message;
        throw error;
      }

      this.user = data.user;
    },
    async signOut() {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.warn("Supabase sign out error:", error);
        return;
      }
      this.user = null;
    },
  },
});

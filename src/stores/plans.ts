import { defineStore } from "pinia";
import { supabase } from "../core/lib/supabaseClient";

export type Plan = {
  id: number;
  date: string;
  mood: string;
  plans: string[];
  food: string;
  note: string;
  user_id: string;
  avatar_url?: string;
  username?: string;
};

export const usePlansStore = defineStore("plans", {
  state: () => ({
    plans: [] as Plan[],
  }),
  actions: {
    async getPlans() {
      const { data, error } = (await supabase
        .from("Planner")
        .select("*,Profiles(avatar_url,username)")) as {
        data: any[] | null;
        error: unknown;
      };
      if (error) {
        console.warn("error ->", error);
        return;
      }
      this.plans = (data ?? []).map((plan) => ({
        id: plan.id,
        date: plan.date,
        mood: plan.mood,
        plans: plan.plans,
        food: plan.food,
        note: plan.note,
        user_id: plan.user_id,
        avatar_url: plan.Profiles?.avatar_url,
        username: plan.Profiles?.username,
      }));
    },
  },
});

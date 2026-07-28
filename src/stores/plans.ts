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
  is_completed?: boolean | null;
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
      this.plans = (data ?? [])
        .filter((plan) => plan.is_completed !== true)
        .map((plan) => ({
          id: plan.id,
          date: plan.date,
          mood: plan.mood,
          plans: plan.plans,
          food: plan.food,
          note: plan.note,
          user_id: plan.user_id,
          avatar_url: plan.Profiles?.avatar_url,
          username: plan.Profiles?.username,
          is_completed: plan.is_completed ?? false,
        }))
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
    },
  },
});

import { defineStore } from "pinia";
import { supabase } from "../core/lib/supabaseClient";

const bucketName = import.meta.env.VITE_SUPABASE_MEMORIES_BUCKET || "memories";

async function resolveMemoryUrl(memoryUrl: string | null | undefined) {
  if (!memoryUrl) {
    return "";
  }

  const trimmedUrl = memoryUrl.trim();

  const { data } = await supabase.storage
    .from(bucketName)
    .createSignedUrl(trimmedUrl, 60 * 60);
  return data?.signedUrl || "";
}

export type MemoryItem = {
  id: number;
  imageUrl: string;
  date: string;
};

export const useMemoriesStore = defineStore("memories", {
  state: () => ({
    memories: [] as MemoryItem[],
    isLoading: false,
    error: "",
  }),
  actions: {
    async loadMemories() {
      this.isLoading = true;
      this.error = "";

      const { data, error } = await supabase
        .from("Planner")
        .select("id,date,plans,food,note,memory_url")
        .eq("is_completed", true)
        .not("memory_url", "is", null)
        .order("date", { ascending: true });

      this.isLoading = false;

      if (error) {
        this.error = "No se pudieron cargar los recuerdos.";
        console.warn("error ->", error);
        return;
      }

      const memories = await Promise.all(
        (data ?? []).map(async (plan) => ({
          id: plan.id,
          imageUrl: await resolveMemoryUrl(plan.memory_url),
          date: plan.date,
        })),
      );

      this.memories = memories;
    },
  },
});

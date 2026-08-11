import { defineStore } from "pinia";
import { supabase } from "../core/lib/supabaseClient";
import { useUserStore } from "./user";

export type GoofyNote = {
  id?: number | string;
  name: string;
  participants: string[];
  punishments: string[];
  user_id?: string | null;
};

const STORAGE_KEY = "goofynotes-local-cache";

function readLocalNotes(): GoofyNote[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as GoofyNote[]) : [];
  } catch {
    return [];
  }
}

function writeLocalNotes(notes: GoofyNote[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch {
    // ignore storage issues
  }
}

export const useGoofyNotesStore = defineStore("goofynotes", {
  state: () => ({
    notes: [] as GoofyNote[],
    note: null as GoofyNote | null,
    isLoading: false,
    isSaving: false,
    error: "" as string,
  }),
  actions: {
    async loadNotes() {
      this.isLoading = true;
      this.error = "";

      const userStore = useUserStore();

      try {
        const { data, error } = await supabase
          .from("GoofyNotes")
          .select("id,name,participants,punishments,user_id")
          .eq("user_id", userStore.user?.id);
        if (error) {
          throw error;
        }

        this.notes = (data ?? []) as GoofyNote[];

        if (!this.notes.length) {
          const localNotes = readLocalNotes();
          this.notes = localNotes;
        }
      } catch (error) {
        console.warn("Goofy notes fallback to local storage:", error);
        this.notes = readLocalNotes();
        this.error = "No se pudieron cargar las notas desde Supabase.";
      } finally {
        this.isLoading = false;
      }
    },

    async createNote(note: Omit<GoofyNote, "id">) {
      this.isSaving = true;
      this.error = "";

      const userStore = useUserStore();
      const safeNote: GoofyNote = {
        name: note.name.trim(),
        participants: note.participants.filter(Boolean),
        punishments: note.punishments.filter(Boolean),
        user_id: userStore.user?.id ?? null,
      };

      try {
        const { data, error } = await supabase
          .from("GoofyNotes")
          .insert(safeNote)
          .select("id,name,participants,punishments,user_id")
          .single();

        if (error) {
          throw error;
        }

        const savedNote = {
          ...safeNote,
          ...(data ?? {}),
        } as GoofyNote;

        this.notes = [savedNote, ...this.notes];
        writeLocalNotes(this.notes);
        return savedNote;
      } catch (error) {
        console.warn("Save goofy note fallback to local storage:", error);

        const fallbackItem: GoofyNote = {
          id: Date.now(),
          ...safeNote,
        };

        const nextNotes = [fallbackItem, ...this.notes];
        this.notes = nextNotes;
        writeLocalNotes(nextNotes);
        return fallbackItem;
      } finally {
        this.isSaving = false;
      }
    },
    async loadNoteById(id: string) {
      this.isLoading = true;
      this.error = "";

      try {
        const { data, error } = await supabase
          .from("GoofyNotes")
          .select("id,name,participants,punishments,user_id")
          .eq("id", id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          this.note = data as GoofyNote;
        }
      } catch (error) {
        console.warn("Failed to load goofy note:", error);
        this.error = "No se pudo cargar la nota.";
      } finally {
        this.isLoading = false;
      }
    },
  },
});

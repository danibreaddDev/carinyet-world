import { defineStore } from "pinia";
import { supabase } from "../core/lib/supabaseClient";
import { useUserStore } from "./user";
import type { ColorKey } from "../modules/GoofyNotes/colors";

export type ParticipantObj = { participant: string; color?: ColorKey };

export type GoofyNote = {
  id?: number | string;
  name: string;
  participants: ParticipantObj[];
  punishments: string[];
  notes?: Record<string, string[]>;
  user_id?: string | null;
};

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
          .select("id,name,participants,punishments,notes,user_id")
          .eq("user_id", userStore.user?.id);
        if (error) {
          throw error;
        }

        this.notes = (data ?? []) as GoofyNote[];
      } catch (error) {
        console.warn("Goofy notes fallback to local storage:", error);
        this.notes = [];
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
        participants: (note.participants || []).filter(
          (p: any) => p && p.participant,
        ),
        punishments: note.punishments.filter(Boolean),
        user_id: userStore.user?.id ?? null,
      };

      try {
        const { data, error } = await supabase
          .from("GoofyNotes")
          .insert(safeNote)
          .select("id,name,participants,punishments,notes,user_id")
          .single();

        if (error) {
          throw error;
        }

        const savedNote = {
          ...safeNote,
          ...(data ?? {}),
        } as GoofyNote;

        this.notes = [savedNote, ...this.notes];
        return savedNote;
      } catch (error) {
        console.warn("Save goofy note failed:", error);
        this.error = "No se pudo guardar la nota en Supabase.";
        return null as any;
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
          .select("id,name,participants,punishments,notes,user_id")
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
    async updateNote(id: string | number, payload: Partial<GoofyNote>) {
      this.isSaving = true;
      this.error = "";

      try {
        const safePayload: Partial<GoofyNote> = {};
        if (payload.name !== undefined)
          safePayload.name = String(payload.name).trim();
        if (payload.participants !== undefined)
          safePayload.participants = (payload.participants || []).filter(
            (p: any) => p && p.participant,
          );
        if (payload.punishments !== undefined)
          safePayload.punishments = (payload.punishments || []).filter(Boolean);

        const { data, error } = await supabase
          .from("GoofyNotes")
          .update(safePayload)
          .eq("id", id)
          .select("id,name,participants,punishments,notes,user_id")
          .single();

        if (error) throw error;

        const updated = { ...(data ?? {}), ...safePayload } as GoofyNote;

        // update list
        this.notes = this.notes.map((n) =>
          String(n.id) === String(id) ? updated : n,
        );

        // if current note opened, update it
        if (this.note && String(this.note.id) === String(id)) {
          this.note = updated;
        }

        return updated;
      } catch (error) {
        console.warn("Failed to update goofy note:", error);
        this.error = "No se pudo actualizar la nota.";
        return null as any;
      } finally {
        this.isSaving = false;
      }
    },
  },
});

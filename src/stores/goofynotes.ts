import { defineStore } from "pinia";
import { supabase } from "../core/lib/supabaseClient";
import { useUserStore } from "./user";
import { useCharacterStore } from "./character";
import type { ColorKey } from "../modules/GoofyNotes/colors";

export type ParticipantObj = {
  participant: string;
  color?: ColorKey;
  notes?: string[];
};
export type GoofyNoteStatus = "pending" | "completed";

export type GoofyNote = {
  id?: number | string;
  name: string;
  participants: ParticipantObj[];
  punishments: string[];
  status?: GoofyNoteStatus;
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

      if (!userStore.user?.id) {
        await userStore.initAuth();
      }

      if (!userStore.user?.id) {
        this.notes = [];
        this.error = "No hay usuario autenticado para cargar las notas.";
        this.isLoading = false;
        return;
      }

      try {
        const { data, error } = await supabase
          .from("GoofyNotes")
          .select("id,name,participants,punishments,status,user_id")
          .eq("user_id", userStore.user.id);

        if (error) {
          throw error;
        }

        this.notes = (data ?? []).map((note) => ({
          ...note,
          participants: (note.participants ?? []).map((participant: any) => ({
            participant: participant.participant,
            color: participant.color,
            notes: Array.isArray(participant.notes)
              ? participant.notes.filter(Boolean)
              : [],
          })),
          status: note.status ?? "pending",
        })) as GoofyNote[];
      } catch (error) {
        console.warn("Failed to load goofy notes:", error);
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

      if (!userStore.user?.id) {
        await userStore.initAuth();
      }

      if (!userStore.user?.id) {
        this.error = "Debes iniciar sesión para guardar la nota.";
        this.isSaving = false;
        return null as any;
      }

      const safeNote: GoofyNote = {
        name: note.name.trim(),
        participants: (note.participants || [])
          .map((p: any) => ({
            participant: p.participant,
            color: p.color,
            notes: Array.isArray(p.notes) ? p.notes.filter(Boolean) : [],
          }))
          .filter((p: any) => p && p.participant),
        punishments: (note.punishments || []).filter(Boolean),
        status: "pending",
        user_id: userStore.user.id,
      };

      try {
        const { data, error } = await supabase
          .from("GoofyNotes")
          .insert(safeNote)
          .select("id,name,participants,punishments,status,user_id")
          .single();

        if (error) {
          throw error;
        }

        const createdNote = {
          ...safeNote,
          ...(data ?? {}),
          status: data?.status ?? safeNote.status ?? "pending",
          user_id: userStore.user.id,
        } as GoofyNote;

        this.notes = [createdNote, ...this.notes];

        return data as GoofyNote;
      } catch (error) {
        console.warn("Save goofy note failed:", error);
        this.error = "No se pudo guardar la nota en Supabase.";
        return null as any;
      } finally {
        this.isSaving = false;
      }
    },
    async refreshNoteById(id: string | number) {
      try {
        const { data, error } = await supabase
          .from("GoofyNotes")
          .select("id,name,participants,punishments,status,user_id")
          .eq("id", id)
          .single();

        if (error) {
          throw error;
        }

        if (!data) return null;

        const refreshedNote = {
          ...data,
          participants: (data.participants ?? []).map((participant: any) => ({
            participant: participant.participant,
            color: participant.color,
            notes: Array.isArray(participant.notes)
              ? participant.notes.filter(Boolean)
              : [],
          })),
          status: data.status ?? "pending",
        } as GoofyNote;

        this.notes = this.notes.map((item) =>
          String(item.id) === String(id) ? refreshedNote : item,
        );

        if (this.note && String(this.note.id) === String(id)) {
          this.note = refreshedNote;
        }

        return refreshedNote;
      } catch (error) {
        console.warn("Failed to refresh goofy note:", error);
        return null;
      }
    },
    async loadNoteById(id: string) {
      this.isLoading = true;
      this.error = "";

      try {
        const refreshedNote = await this.refreshNoteById(id);
        this.note = refreshedNote ?? this.note;
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
          safePayload.participants = (payload.participants || [])
            .map((p: any) => ({
              participant: p.participant,
              color: p.color,
              notes: Array.isArray(p.notes) ? p.notes.filter(Boolean) : [],
            }))
            .filter((p: any) => p && p.participant);
        if (payload.punishments !== undefined)
          safePayload.punishments = (payload.punishments || []).filter(Boolean);
        if (payload.status !== undefined) safePayload.status = payload.status;

        const { data, error } = await supabase
          .from("GoofyNotes")
          .update(safePayload)
          .eq("id", id)
          .select("id,name,participants,punishments,status,user_id")
          .single();

        if (error) throw error;

        const updated = {
          ...(data ?? {}),
          ...safePayload,
          status: (data?.status ??
            safePayload.status ??
            "pending") as GoofyNoteStatus,
        } as GoofyNote;

        this.notes = this.notes.map((n) =>
          String(n.id) === String(id) ? updated : n,
        );

        const refreshedNote = await this.refreshNoteById(id);

        if (refreshedNote) {
          this.notes = this.notes.map((n) =>
            String(n.id) === String(id) ? refreshedNote : n,
          );

          if (this.note && String(this.note.id) === String(id)) {
            this.note = refreshedNote;
          }

          return refreshedNote;
        }

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
    async finishNote(id: string | number) {
      const note =
        this.note && String(this.note.id) === String(id)
          ? this.note
          : (this.notes.find((item) => String(item.id) === String(id)) ?? null);

      if (!note) return null;
      if (note.status === "completed") return note;

      const participantCounts = (note.participants ?? []).map(
        (participant) => ({
          participant: participant.participant,
          count: Array.isArray(participant.notes)
            ? participant.notes.length
            : 0,
        }),
      );

      const winner = participantCounts.reduce<{
        participant: string;
        count: number;
      } | null>((best, current) => {
        if (!best || current.count > best.count) return current;
        return best;
      }, null);

      const updated = await this.updateNote(id, { status: "completed" });

      if (!updated) return null;

      if (
        winner &&
        (winner.participant.toLowerCase() === "mar" ||
          winner.participant.toLowerCase() === "Mar" ||
          winner.participant.toLowerCase() === "MAR")
      ) {
        const characterStore = useCharacterStore();
        const selectedCharacter =
          sessionStorage.getItem("selectedCharacter") ?? "kuromi";

        if (!characterStore.character.id) {
          await characterStore.loadCharacter(selectedCharacter);
        } else if (characterStore.character.id !== selectedCharacter) {
          await characterStore.loadCharacter(selectedCharacter);
        }

        await characterStore.increaseLevel();
      }

      return updated;
    },
  },
});

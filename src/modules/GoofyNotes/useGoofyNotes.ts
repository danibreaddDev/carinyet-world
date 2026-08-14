import { computed, ref } from "vue";
import { useGoofyNotesStore } from "../../stores/goofynotes";
import { supabase } from "../../core/lib/supabaseClient";
import type { ColorKey } from "./colors";

export async function saveMoments(
  noteId: string | number,
  moments: Record<string, string[]>,
) {
  try {
    const { error } = await supabase
      .from("GoofyNotes")
      .update({ notes: moments })
      .eq("id", noteId);
    if (error) {
      console.warn("Failed to sync moments to Supabase:", error);
      return { ok: false, error };
    }
    return { ok: true };
  } catch (e) {
    console.warn("Supabase sync error:", e);
    return { ok: false, error: e };
  }
}

export function loadMomentsFromNote(note: any): Record<string, string[]> {
  if (!note || !note.id) return {};
  try {
    if (note.notes && typeof note.notes === "object") {
      return note.notes as Record<string, string[]>;
    }
    return {};
  } catch (e) {
    return {};
  }
}

export function useGoofyNotes() {
  const goofyNotesStore = useGoofyNotesStore();

  const noteName = ref("");
  const participantInput = ref("");
  const participantColor = ref<ColorKey | undefined>(undefined);
  const punishmentInput = ref("");
  const participants = ref<{ participant: string; color?: ColorKey }[]>([]);
  const punishments = ref<string[]>([]);

  const participantLabel = computed(() =>
    participants.value.length > 0
      ? `${participants.value.length} participante${participants.value.length > 1 ? "s" : ""}`
      : "Ningún participante seleccionado",
  );

  const addParticipant = (color?: ColorKey) => {
    const value = participantInput.value.trim();
    const col = color ?? participantColor.value ?? (undefined as any);

    if (!value || participants.value.some((p) => p.participant === value)) {
      participantInput.value = "";
      participantColor.value = undefined;
      return;
    }

    participants.value = [
      ...participants.value,
      { participant: value, color: col },
    ];
    participantInput.value = "";
    participantColor.value = undefined;
  };

  const removeParticipant = (participantName: string) => {
    participants.value = participants.value.filter(
      (item) => item.participant !== participantName,
    );
  };

  const addPunishment = () => {
    const value = punishmentInput.value.trim();

    if (!value || punishments.value.includes(value)) {
      punishmentInput.value = "";
      return;
    }

    punishments.value = [...punishments.value, value];
    punishmentInput.value = "";
  };

  const removePunishment = (punishment: string) => {
    punishments.value = punishments.value.filter((item) => item !== punishment);
  };

  const resetForm = () => {
    noteName.value = "";
    participantInput.value = "";
    punishmentInput.value = "";
    participants.value = [];
    punishments.value = [];
  };

  const initEdit = (note: any) => {
    noteName.value = note?.name ?? "";
    participants.value = (note?.participants || []).map((p: any) => ({
      participant: p.participant,
      color: p.color,
    })) as any;
    punishments.value = (note?.punishments || []).slice();
  };

  const updateNote = async (id: string | number) => {
    if (!id) return null;
    const payload = {
      name: noteName.value.trim(),
      participants: participants.value,
      punishments: punishments.value,
    } as Partial<any>;

    const updated = await goofyNotesStore.updateNote(id, payload);
    return updated;
  };

  const saveNote = async () => {
    if (!noteName.value.trim() || !participants.value.length) {
      return false;
    }

    await goofyNotesStore.createNote({
      name: noteName.value.trim(),
      participants: participants.value,
      punishments: punishments.value,
    });

    resetForm();
    return true;
  };

  return {
    noteName,
    participantInput,
    participantColor,
    punishmentInput,
    participants,
    punishments,
    participantLabel,
    addParticipant,
    removeParticipant,
    addPunishment,
    removePunishment,
    saveNote,
    isSaving: computed(() => goofyNotesStore.isSaving),
    isLoading: computed(() => goofyNotesStore.isLoading),
    error: computed(() => goofyNotesStore.error),
    resetForm,
    initEdit,
    updateNote,
    saveMoments,
    loadMomentsFromNote,
  };
}

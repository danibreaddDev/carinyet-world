import { computed, ref } from "vue";
import { useGoofyNotesStore } from "../../stores/goofynotes";
import { supabase } from "../../core/lib/supabaseClient";
import type { ColorKey } from "./colors";

export async function saveMoments(
  noteId: string | number,
  moments: Record<string, string[]>,
) {
  try {
    const store = useGoofyNotesStore();
    const currentNote =
      (store.note && String(store.note.id) === String(noteId)
        ? store.note
        : store.notes.find((note) => String(note.id) === String(noteId))) ??
      null;

    const currentParticipants = Array.isArray(currentNote?.participants)
      ? currentNote.participants
      : [];

    const nextParticipants =
      currentParticipants.length > 0
        ? currentParticipants.map((participant: any) => ({
            participant: participant.participant,
            color: participant.color,
            notes: Array.isArray(moments?.[participant.participant])
              ? moments[participant.participant].filter(Boolean)
              : [],
          }))
        : Object.keys(moments ?? {}).map((participantName) => ({
            participant: participantName,
            notes: Array.isArray(moments[participantName])
              ? moments[participantName].filter(Boolean)
              : [],
          }));

    const { error: updateError } = await supabase
      .from("GoofyNotes")
      .update({ participants: nextParticipants })
      .eq("id", noteId);

    if (updateError) {
      console.warn("Failed to sync moments to Supabase:", updateError);
      return { ok: false, error: updateError };
    }

    if (store.note && String(store.note.id) === String(noteId)) {
      store.note = {
        ...store.note,
        participants: nextParticipants,
      };
    }

    store.notes = store.notes.map((note) =>
      String(note.id) === String(noteId)
        ? { ...note, participants: nextParticipants }
        : note,
    );

    return { ok: true };
  } catch (e) {
    console.warn("Supabase sync error:", e);
    return { ok: false, error: e };
  }
}

export function loadMomentsFromNote(note: any): Record<string, string[]> {
  if (!note || !note.id) return {};
  try {
    const participants: Array<{ participant: string; notes?: string[] }> =
      Array.isArray(note.participants) ? note.participants : [];

    return participants.reduce<Record<string, string[]>>(
      (
        accumulator: Record<string, string[]>,
        participant: { participant: string; notes?: string[] },
      ) => {
        accumulator[participant.participant] = Array.isArray(participant.notes)
          ? participant.notes.filter(Boolean)
          : [];
        return accumulator;
      },
      {},
    );
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
  const participants = ref<
    { participant: string; color?: ColorKey; notes?: string[] }[]
  >([]);
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
      { participant: value, color: col, notes: [] },
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
      notes: Array.isArray(p.notes) ? p.notes.filter(Boolean) : [],
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
    if (updated) {
      await goofyNotesStore.loadNoteById(String(id));
      return updated;
    }

    return null;
  };

  const saveNote = async () => {
    if (!noteName.value.trim() || !participants.value.length) {
      return false;
    }

    const created = await goofyNotesStore.createNote({
      name: noteName.value.trim(),
      participants: participants.value,
      punishments: punishments.value,
    });

    if (created && created.id) {
      await goofyNotesStore.loadNoteById(String(created.id));
    }

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

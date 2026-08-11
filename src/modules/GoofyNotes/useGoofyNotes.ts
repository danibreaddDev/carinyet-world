import { computed, ref } from "vue";
import { useGoofyNotesStore } from "../../stores/goofynotes";

export function useGoofyNotes() {
  const goofyNotesStore = useGoofyNotesStore();

  const noteName = ref("");
  const participantInput = ref("");
  const punishmentInput = ref("");
  const participants = ref<string[]>([]);
  const punishments = ref<string[]>([]);

  const participantLabel = computed(() =>
    participants.value.length > 0
      ? `${participants.value.length} participante${participants.value.length > 1 ? "s" : ""}`
      : "Ningún participante seleccionado",
  );

  const addParticipant = () => {
    const value = participantInput.value.trim();

    if (!value || participants.value.includes(value)) {
      participantInput.value = "";
      return;
    }

    participants.value = [...participants.value, value];
    participantInput.value = "";
  };

  const removeParticipant = (participant: string) => {
    participants.value = participants.value.filter(
      (item) => item !== participant,
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
  };
}

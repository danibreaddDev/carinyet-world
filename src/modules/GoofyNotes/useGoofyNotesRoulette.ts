import { computed, ref } from "vue";
import { useCharacterStore } from "../../stores/character";

export type RouletteAction = "completed" | "failed";

export function useGoofyNotesRoulette(punishments: string[]) {
  const characterStore = useCharacterStore();
  const rotation = ref(0);
  const selectedPunishment = ref("");
  const isSpinning = ref(false);
  const pendingAction = ref<RouletteAction | null>(null);
  const pointerAngle = 0;

  const segments = computed(() => {
    const items = (punishments ?? []).filter(Boolean);
    if (!items.length) return [];

    const slice = 360 / items.length;

    return items.map((punishment, index) => {
      const start = index * slice;
      const end = start + slice;

      return {
        punishment,
        start,
        end,
        center: start + slice / 2,
      };
    });
  });

  const wheelGradient = computed(() => {
    const colors = [
      "#f9a8d4",
      "#fbcfe8",
      "#fce7f3",
      "#ddd6fe",
      "#fde68a",
      "#fecaca",
      "#bfdbfe",
      "#bbf7d0",
    ];

    const items = segments.value;
    if (!items.length) return "transparent";

    const stops = items
      .map((segment, index) => {
        const color = colors[index % colors.length];
        return `${color} ${segment.start}deg ${segment.end}deg`;
      })
      .join(", ");

    return `conic-gradient(from -90deg, ${stops})`;
  });

  const wheelStyle = computed(() => ({
    transform: `rotate(${rotation.value}deg)`,
    transition: isSpinning.value
      ? "transform 4.8s cubic-bezier(0.15, 0.9, 0.2, 1.05)"
      : "none",
  }));

  const getLabelStyle = (segment: { center: number }) => {
    const radius = 110;
    const angle = ((segment.center - 90) * Math.PI) / 180;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    return {
      left: "50%",
      top: "50%",
      transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
    };
  };

  const ensureCharacterLoaded = async () => {
    const selectedCharacter =
      sessionStorage.getItem("selectedCharacter") ?? "kuromi";

    if (!characterStore.character.id) {
      await characterStore.loadCharacter(selectedCharacter);
      return;
    }

    if (characterStore.character.id !== selectedCharacter) {
      await characterStore.loadCharacter(selectedCharacter);
    }
  };

  const getWinnerFromPointer = (currentRotation: number) => {
    const items = (punishments ?? []).filter(Boolean);
    if (!items.length) return null;

    const normalizedRotation = ((currentRotation % 360) + 360) % 360;

    let winnerIndex = 0;
    let minDistance = Number.POSITIVE_INFINITY;

    segments.value.forEach((segment, index) => {
      const segmentAngle =
        (((segment.center + normalizedRotation) % 360) + 360) % 360;
      const distance = Math.min(
        Math.abs(segmentAngle - pointerAngle),
        Math.abs(segmentAngle - pointerAngle + 360),
        Math.abs(segmentAngle - pointerAngle - 360),
      );

      if (distance < minDistance) {
        minDistance = distance;
        winnerIndex = index;
      }
    });

    return winnerIndex;
  };

  const spinRoulette = () => {
    const items = (punishments ?? []).filter(Boolean);
    if (!items.length || isSpinning.value) return;

    const winnerIndex = Math.floor(Math.random() * items.length);
    const win = segments.value[winnerIndex];
    const extraTurns = 5 + Math.floor(Math.random() * 3);
    const nextRotation =
      rotation.value + extraTurns * 360 + (360 - (win?.center ?? 0));

    isSpinning.value = true;
    selectedPunishment.value = "";
    rotation.value = nextRotation;

    window.setTimeout(() => {
      const finalWinnerIndex =
        getWinnerFromPointer(rotation.value) ?? winnerIndex;
      selectedPunishment.value = items[finalWinnerIndex];
      isSpinning.value = false;
    }, 4800);
  };

  const chooseCompleted = () => {
    pendingAction.value = "completed";
  };

  const chooseFailed = () => {
    pendingAction.value = "failed";
  };

  const cancelAction = () => {
    pendingAction.value = null;
  };

  const confirmAction = async () => {
    if (!pendingAction.value) return;

    if (pendingAction.value === "completed") {
      await ensureCharacterLoaded();
      await characterStore.increaseLevel();
    }

    if (pendingAction.value === "failed") {
      await ensureCharacterLoaded();
      await characterStore.decreaseLevel();
    }

    pendingAction.value = null;
    return true;
  };

  return {
    rotation,
    selectedPunishment,
    isSpinning,
    pendingAction,
    segments,
    wheelGradient,
    wheelStyle,
    getLabelStyle,
    spinRoulette,
    chooseCompleted,
    chooseFailed,
    cancelAction,
    confirmAction,
  };
}

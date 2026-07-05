import { onMounted, ref } from "vue";
import { useMusicStore } from "../../stores/music.ts";
import { useSpotifyStore } from "../../stores/spotify.ts";
import { useCharacterStore } from "../../stores/character.ts";
import { useUserStore } from "../../stores/user.ts";

const normalizeMusicValue = (value: string, type: "spotify" | "apple") => {
  const trimmedValue = value.trim();

  if (!trimmedValue) return "";

  if (trimmedValue.startsWith("spotify:")) {
    const parts = trimmedValue.split(":");
    return parts[parts.length - 1] || trimmedValue;
  }

  try {
    const url = new URL(
      trimmedValue.startsWith("http")
        ? trimmedValue
        : `https://${trimmedValue}`,
    );

    if (type === "spotify") {
      const match = url.pathname.match(/\/track\/([^/?#]+)/);
      if (match) return match[1];
    }

    const pathSegments = url.pathname.split("/").filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1] ?? "";
    return lastSegment.replace(/[?#].*$/, "");
  } catch {
    const segments = trimmedValue.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1] ?? trimmedValue;
    return lastSegment.replace(/[?#].*$/, "");
  }
};

export function useMusicPage() {
  const spotifyStore = useSpotifyStore();
  const musicStore = useMusicStore();
  const characterStore = useCharacterStore();

  const appleMusicId = ref("");
  const spotifyId = ref("");
  const message = ref("");
  const isSubmitting = ref(false);
  const submitError = ref("");
  const submitSuccess = ref("");

  const setAppleMusicId = (value: string) => {
    appleMusicId.value = normalizeMusicValue(value, "apple");
  };

  const setSpotifyId = (value: string) => {
    spotifyId.value = normalizeMusicValue(value, "spotify");
  };

  const handleSubmit = async () => {
    const spotifyValue = spotifyId.value.trim();
    const appleValue = appleMusicId.value.trim();
    const messageValue = message.value.trim();

    if (!spotifyValue || !messageValue) {
      submitError.value = "Añade al menos el ID de Spotify y un mensaje.";
      submitSuccess.value = "";
      return;
    }

    isSubmitting.value = true;
    submitError.value = "";
    submitSuccess.value = "";

    const saved = await musicStore.saveRecommendation({
      id: appleValue,
      spotifyId: spotifyValue,
      message: messageValue,
      user_id: useUserStore().user?.id,
    });

    if (!saved) {
      submitError.value = "No se pudo guardar la recomendación.";
    } else {
      submitSuccess.value = "Recomendación añadida correctamente.";
      appleMusicId.value = "";
      spotifyId.value = "";
      message.value = "";
    }

    isSubmitting.value = false;
  };

  onMounted(async () => {
    await musicStore.loadSongAndSpotify();
  });

  const handleIncreaseLevel = async () => {
    await characterStore.increaseLevel();
    await musicStore.deleteSongRecommendation();
    await musicStore.loadSongAndSpotify();
  };

  const handleDecreaseLevel = async () => {
    await characterStore.decreaseLevel();
    await musicStore.deleteSongRecommendation();
    await musicStore.loadSongAndSpotify();
  };

  return {
    spotifyStore,
    musicStore,
    handleIncreaseLevel,
    handleDecreaseLevel,
    appleMusicId,
    spotifyId,
    message,
    isSubmitting,
    submitError,
    submitSuccess,
    setAppleMusicId,
    setSpotifyId,
    handleSubmit,
  };
}

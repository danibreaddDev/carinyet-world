import { onMounted } from "vue";
import { useMusicStore } from "../../stores/music.ts";
import { useSpotifyStore } from "../../stores/spotify.ts";
import { useCharacterStore } from "../../stores/character.ts";

export function useMusicPage() {
  const spotifyStore = useSpotifyStore();
  const musicStore = useMusicStore();
  const characterStore = useCharacterStore();

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
  };
}

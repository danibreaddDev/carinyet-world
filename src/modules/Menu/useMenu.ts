import { useRouter } from "vue-router";

export function useMenu() {
  const router = useRouter();

  const handleStartIn = (characterId: string) => {
    sessionStorage.setItem("selectedCharacter", characterId);
    router.push({ name: "Home" });
  };

  return {
    handleStartIn,
  };
}

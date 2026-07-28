import { onMounted } from "vue";
import { useMemoriesStore } from "../../stores/memories";

export function useMemories() {
  const memoriesStore = useMemoriesStore();

  onMounted(async () => {
    await memoriesStore.loadMemories();
  });

  return {
    memoriesStore,
  };
}

import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { supabase } from "../../core/lib/supabaseClient.ts";
import { useSpotifyStore } from "../../stores/spotify.ts";

export type Plan = {
  id: string;
  title: string;
  image: string;
  moods: string[];
};

export type PlanMood = {
  id: string;
  title: string;
  description: string;
  image: string;
};

export type FoodOption = {
  id: string;
  title: string;
  icon?: any;
};

const planMoods: PlanMood[] = [
  {
    id: "chalant",
    title: "chalant",
    description: "Lo que eres tu.",
    image: "/assets/planner/chalant.png",
  },
  {
    id: "nonchalant",
    title: "nonchalant",
    description: "lo que intentas ser, pero soy yo.",
    image: "/assets/planner/nonchalant.png",
  },
];

const plans: Plan[] = [
  {
    id: "cena",
    title: "Cena",
    image: "/assets/planner/dinner.png",
    moods: ["nonchalant", "chalant"],
  },
  {
    id: "bubble",
    title: "Bubble tea",
    image: "/assets/planner/bubble.png",
    moods: ["nonchalant", "chalant"],
  },
  {
    id: "cine",
    title: "Cine",
    image: "/assets/planner/cinema.png",
    moods: ["nonchalant", "chalant"],
  },
  {
    id: "caminar",
    title: "Paseito",
    image: "/assets/planner/walk.png",
    moods: ["nonchalant", "chalant"],
  },
  {
    id: "sorpresa",
    title: "sorpresa",
    image: "/assets/planner/surprise.png",
    moods: ["chalant", "nonchalant"],
  },
  {
    id: "arte",
    title: "Arte",
    image: "/assets/planner/art.png",
    moods: ["nonchalant"],
  },
  {
    id: "gym",
    title: "Gym",
    image: "/assets/planner/gym.png",
    moods: ["nonchalant", "chalant"],
  },
];

const foodOptions: FoodOption[] = [
  {
    id: "pizza",
    title: "Pizza",
    icon: null,
  },
  {
    id: "sushi",
    title: "Sushi",
    icon: null,
  },
  {
    id: "burguer",
    title: "Burger",
    icon: null,
  },
  {
    id: "pasta",
    title: "Pasta",
    icon: null,
  },
  {
    id: "ramen",
    title: "Ramen",
    icon: null,
  },
  {
    id: "otro",
    title: "Otro",
    icon: null,
  },
];

const finalImages = [
  "/assets/home/hellokitty_icon.png",
  "/assets/home/mymelody_icon.png",
  "/assets/home/cinamonroll_icon.png",
  "/assets/home/pompurin_icon.png",
];

const noHoverMessages = [
  "Eso no era una opcion real.",
  "Mmm... prueba otra vez, valiente.",
  "El boton tambien quiere que digas que si.",
  "Casi, pero no.",
  "Tu destino esta en el otro boton.",
  "No huyas de nuestra cita.",
];

export function usePlanner() {
  const step = ref(0);
  const noPosition = ref({ x: 0, y: 0 });
  const noEscaped = ref(false);
  const noHoverMessageIndex = ref(-1);
  const isMobile = ref(false);
  const selectedDate = ref("");
  const pickupNote = ref("");
  const selectedPlanMood = ref("");
  const selectedPlans = ref<string[]>([]);
  const selectedFood = ref("");
  const isSubmitting = ref(false);
  const submitError = ref("");
  const showNoDialog = ref(false);
  const finalImageIndex = ref(0);
  let imageTimer: number | undefined;

  const selectedPlanMoodInfo = computed(() =>
    planMoods.find((mood) => mood.id === selectedPlanMood.value),
  );

  const filteredPlans = computed(() =>
    plans.filter((plan) => plan.moods.includes(selectedPlanMood.value)),
  );

  const selectedPlanInfos = computed(() =>
    plans.filter((plan) => selectedPlans.value.includes(plan.id)),
  );

  const dinnerSelected = computed(() => selectedPlans.value.includes("cena"));

  const selectedFoodInfo = computed(() =>
    foodOptions.find((food) => food.id === selectedFood.value),
  );

  const finalImageSrc = computed(
    () => finalImages[finalImageIndex.value] ?? finalImages[0],
  );

  const totalSteps = computed(() => (dinnerSelected.value ? 5 : 4));
  const canContinueDate = computed(() => Boolean(selectedDate.value));
  const canContinueMood = computed(() => Boolean(selectedPlanMood.value));
  const canFinish = computed(() => selectedPlans.value.length > 0);
  const canContinueFood = computed(() => Boolean(selectedFood.value));

  watch(selectedPlanMood, () => {
    selectedPlans.value = [];
    selectedFood.value = "";
  });

  function updateDevice() {
    isMobile.value = window.matchMedia(
      "(hover: none), (pointer: coarse), (max-width: 767px)",
    ).matches;
  }

  function startPlanner() {
    step.value = 1;
  }

  function moveNoButton() {
    if (isMobile.value) {
      showNoDialog.value = true;
      return;
    }

    noEscaped.value = true;
    noHoverMessageIndex.value =
      (noHoverMessageIndex.value + 1) % noHoverMessages.length;

    const safePadding = 28;
    const buttonWidth = 112;
    const buttonHeight = 48;
    const maxX = Math.max(
      safePadding,
      window.innerWidth - buttonWidth - safePadding,
    );
    const maxY = Math.max(
      safePadding,
      window.innerHeight - buttonHeight - safePadding,
    );

    noPosition.value = {
      x: Math.round(safePadding + Math.random() * (maxX - safePadding)),
      y: Math.round(safePadding + Math.random() * (maxY - safePadding)),
    };
  }

  function openNoDialog() {
    showNoDialog.value = true;
  }

  function closeNoDialog() {
    showNoDialog.value = false;
  }

  function nextStep() {
    step.value += 1;
  }

  function previousStep() {
    if (step.value > 1) {
      step.value -= 1;
    }
  }

  function togglePlan(planId: string) {
    selectedPlans.value = selectedPlans.value.includes(planId)
      ? selectedPlans.value.filter((id) => id !== planId)
      : [...selectedPlans.value, planId];

    if (!selectedPlans.value.includes("cena")) {
      selectedFood.value = "";
    }
  }

  function continueFromPlans() {
    nextStep();
  }

  function finishPlanner() {
    step.value = totalSteps.value + 1;
    window.clearInterval(imageTimer);
    imageTimer = window.setInterval(() => {
      finalImageIndex.value = (finalImageIndex.value + 1) % finalImages.length;
    }, 1400);
  }

  async function submitPlanner() {
    submitError.value = "";
    isSubmitting.value = true;

    const payload = {
      date: selectedDate.value,
      mood: selectedPlanMood.value,
      plans: selectedPlans.value,
      food: selectedFood.value || null,
      note: pickupNote.value || null,
      user_id: useSpotifyStore().user?.id,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("Planner")
      .insert(payload)
      .select()
      .single();

    isSubmitting.value = false;

    if (error) {
      submitError.value = "No se pudo guardar la cita. Intenta de nuevo.";
      console.warn("Supabase insert error:", error);
      return;
    }

    if (data) {
      finishPlanner();
    }
  }

  onMounted(() => {
    updateDevice();
    window.addEventListener("resize", updateDevice);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("resize", updateDevice);
    window.clearInterval(imageTimer);
  });

  return {
    planMoods,
    plans,
    foodOptions,
    finalImageSrc,
    noHoverMessages,
    step,
    noPosition,
    noEscaped,
    noHoverMessageIndex,
    isMobile,
    selectedDate,
    pickupNote,
    selectedPlanMood,
    selectedPlans,
    selectedFood,
    isSubmitting,
    submitError,
    showNoDialog,
    selectedPlanMoodInfo,
    filteredPlans,
    selectedPlanInfos,
    dinnerSelected,
    selectedFoodInfo,
    totalSteps,
    canContinueDate,
    canContinueMood,
    canFinish,
    canContinueFood,
    startPlanner,
    moveNoButton,
    openNoDialog,
    closeNoDialog,
    nextStep,
    previousStep,
    togglePlan,
    continueFromPlans,
    submitPlanner,
  };
}

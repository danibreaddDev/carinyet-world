<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { RouterLink } from 'vue-router';
import ArrowLeftCircleIcon from '@iconify-vue/mdi/arrow-left-circle';
import PizzaIcon from '@iconify-vue/mdi/pizza';
import BurgerIcon from '@iconify-vue/mdi/hamburger';
import PastaIcon from '@iconify-vue/mdi/pasta';
import NoodlesIcon from '@iconify-vue/mdi/noodles';
import SushiFilledIcon from '@iconify-vue/boxicons/sushi-filled';
import FoodIcon from '@iconify-vue/mdi/food';
import hamsterQuestion from "/assets/planner/Hamster_question.webp";
import hamsterFinal from "/assets/planner/Hamster_final.webp";
import ProfileCard from '../../components/ProfileCard.vue';

type Plan = {
    id: string;
    title: string;
    image: string;
    moods: string[];
};

type PlanMood = {
    id: string;
    title: string;
    description: string;
    image: string;
};

type FoodOption = {
    id: string;
    title: string;
    icon?: any;
};

const planMoods: PlanMood[] = [
    {
        id: 'chalant',
        title: 'chalant',
        description: 'anem a fer el gamba',
        image: '/assets/planner/chalant.png'
    },
    {
        id: 'nonchalant',
        title: 'nonchalant',
        description: 'modo serio (se intenta vale)',
        image: '/assets/planner/nonchalant.png'

    },
];

const plans: Plan[] = [
    {
        id: 'dinner',
        title: 'Cena',
        image: '/assets/planner/dinner.png',
        moods: ['nonchalant', 'chalant'],
    },
    {
        id: 'bubble',
        title: 'Bubble tea',
        image: '/assets/planner/bubble.png',
        moods: ['nonchalant', 'chalant'],
    },
    {
        id: 'cinema',
        title: 'Cine',
        image: '/assets/planner/cinema.png',
        moods: ['nonchalant', 'chalant'],
    },
    {
        id: 'walk',
        title: 'Paseito',
        image: '/assets/planner/walk.png',
        moods: ['nonchalant', 'chalant'],
    },
    {
        id: 'surprise',
        title: 'sorpresa',
        image: '/assets/planner/surprise.png',
        moods: ['chalant', 'nonchalant'],
    },
    {
        id: 'art',
        title: 'Arte',
        image: '/assets/planner/art.png',
        moods: ['nonchalant'],
    },
    {
        id: 'gym',
        title: 'Gym',
        image: '/assets/planner/gym.png',
        moods: ['nonchalant', 'chalant'],
    },
];

const foodOptions: FoodOption[] = [
    {
        id: 'pizza',
        title: 'Pizza',
        icon: PizzaIcon,
    },
    {
        id: 'sushi',
        title: 'Sushi',
        icon: SushiFilledIcon
    },
    {
        id: 'burguer',
        title: 'Burger',
        icon: BurgerIcon,
    },
    {
        id: 'pasta',
        title: 'Pasta',
        icon: PastaIcon,
    },
    {
        id: 'ramen',
        title: 'Ramen',
        icon: NoodlesIcon,
    },
    {
        id: 'otro',
        title: 'Otro',
        icon: FoodIcon,
    }
];

const finalImages = [
    '/assets/home/hellokitty_icon.png',
    '/assets/home/mymelody_icon.png',
    '/assets/home/cinamonroll_icon.png',
    '/assets/home/pompurin_icon.png',
];

const noHoverMessages = [
    'Eso no era una opcion real.',
    'Mmm... prueba otra vez, valiente.',
    'El boton tambien quiere que digas que si.',
    'Casi, pero no.',
    'Tu destino esta en el otro boton.',
    'No huyas de nuestra cita.',
];

const step = ref(0);
const noPosition = ref({ x: 0, y: 0 });
const noEscaped = ref(false);
const noHoverMessageIndex = ref(-1);
const isMobile = ref(false);
const selectedDate = ref('');
const pickupNote = ref('');
const selectedPlanMood = ref('');
const selectedPlans = ref<string[]>([]);
const selectedFood = ref('');
const finalImageIndex = ref(0);
let imageTimer: number | undefined;

const selectedPlanMoodInfo = computed(() => planMoods.find((mood) => mood.id === selectedPlanMood.value));
const filteredPlans = computed(() => plans.filter((plan) => plan.moods.includes(selectedPlanMood.value)));
const selectedPlanInfos = computed(() => plans.filter((plan) => selectedPlans.value.includes(plan.id)));
const dinnerSelected = computed(() => selectedPlans.value.includes('dinner'));
const selectedFoodInfo = computed(() => foodOptions.find((food) => food.id === selectedFood.value));
const totalSteps = computed(() => (dinnerSelected.value ? 5 : 4));
const canContinueDate = computed(() => Boolean(selectedDate.value));
const canContinueMood = computed(() => Boolean(selectedPlanMood.value));
const canFinish = computed(() => selectedPlans.value.length > 0);
const canContinueFood = computed(() => Boolean(selectedFood.value));

watch(selectedPlanMood, () => {
    selectedPlans.value = [];
    selectedFood.value = '';
});

function updateDevice() {
    isMobile.value = window.matchMedia('(hover: none), (pointer: coarse), (max-width: 767px)').matches;
}

function startPlanner() {
    step.value = 1;
}

function moveNoButton() {
    if (isMobile.value) return;
    noEscaped.value = true;
    noHoverMessageIndex.value = (noHoverMessageIndex.value + 1) % noHoverMessages.length;

    const safePadding = 28;
    const buttonWidth = 112;
    const buttonHeight = 48;
    const maxX = Math.max(safePadding, window.innerWidth - buttonWidth - safePadding);
    const maxY = Math.max(safePadding, window.innerHeight - buttonHeight - safePadding);

    noPosition.value = {
        x: Math.round(safePadding + Math.random() * (maxX - safePadding)),
        y: Math.round(safePadding + Math.random() * (maxY - safePadding)),
    };
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

    if (!selectedPlans.value.includes('dinner')) {
        selectedFood.value = '';
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

onMounted(() => {
    updateDevice();
    window.addEventListener('resize', updateDevice);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', updateDevice);
    window.clearInterval(imageTimer);
});
</script>

<template>
    <section class="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-5">
        <RouterLink to="/home" class="text-pink-200 border p-2 bg-pink-200 rounded-full w-fit">
            <ArrowLeftCircleIcon class="text-pink-400 size-8" />
        </RouterLink>

        <ProfileCard />

        <div v-if="step === 0" class="grid place-items-center">
            <section class="w-full rounded-lg border border-pink-200 bg-white p-6 text-center flex flex-col shadow-sm">
                <h1 class="text-4xl font-bold text-pink-400">Xoxete, se vem un rato?</h1>
                <img :src="hamsterQuestion" alt="date" class="size-32 self-center">

                <div class="relative mt-8 flex min-h-28 items-start justify-center gap-4">
                    <div class="flex min-w-28 flex-col items-center gap-3">
                        <button type="button"
                            class="rounded-lg bg-pink-400 px-8 py-3 text-lg font-bold text-white shadow-sm transition hover:bg-pink-500"
                            @click="startPlanner">
                            Si
                        </button>
                        <p v-if="noHoverMessageIndex >= 0"
                            class="min-h-12 max-w-52 text-balance text-sm font-bold text-pink-300 hidden md:block">
                            {{ noHoverMessages[noHoverMessageIndex] }}
                        </p>
                    </div>

                    <button type="button"
                        class="rounded-lg border border-pink-200 bg-white px-8 py-3 text-lg font-bold text-pink-300 shadow-sm transition disabled:cursor-not-allowed disabled:opacity-40"
                        :disabled="isMobile" :class="{ 'md:fixed': noEscaped }"
                        :style="noEscaped ? { left: `${noPosition.x}px`, top: `${noPosition.y}px` } : undefined"
                        @mouseenter="moveNoButton" @focus="moveNoButton">
                        No
                    </button>
                </div>
            </section>
        </div>

        <section v-else class="rounded-lg border border-pink-200 bg-white p-5 shadow-sm">
            <div v-if="step <= totalSteps" class="mb-6 flex items-center justify-between gap-4">
                <div>
                    <p class="text-sm font-bold uppercase text-pink-300">Paso {{ step }} de {{ totalSteps }}</p>
                </div>
                <button v-if="step > 1" type="button"
                    class="rounded-lg border border-pink-200 px-4 py-2 font-bold text-pink-300" @click="previousStep">
                    Atras
                </button>
            </div>

            <div v-if="step === 1" class="flex flex-col gap-5">
                <label class="flex flex-col gap-2 text-pink-300">
                    <span class="text-lg font-bold">Día</span>
                    <input v-model="selectedDate" type="date"
                        class="rounded-lg border border-pink-200 px-4 py-3 text-pink-400 outline-none focus:border-pink-400">
                </label>

                <button type="button"
                    class="mt-2 rounded-lg bg-pink-400 px-5 py-3 text-lg font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
                    :disabled="!canContinueDate" @click="nextStep">
                    Siguiente
                </button>
            </div>

            <div v-else-if="step === 2" class="flex flex-col gap-5">
                <h2 class="text-2xl font-bold text-pink-400">Va a ser siempre igual pero ¿Que plan?</h2>
                <div class="grid gap-3 sm:grid-cols-2">
                    <button v-for="mood in planMoods" :key="mood.id" type="button"
                        class="flex min-h-32 flex-col justify-center gap-2 rounded-lg border p-4 text-left transition"
                        :class="selectedPlanMood === mood.id ? 'border-pink-400 bg-pink-100' : 'border-pink-200 bg-white'"
                        @click="selectedPlanMood = mood.id">
                        <span class="text-xl font-bold text-pink-400">{{ mood.title }}</span>
                        <span class="text-pink-300">{{ mood.description }}</span>
                        <img :src="mood.image" :alt="mood.title" class="size-24">
                    </button>
                </div>

                <button type="button"
                    class="rounded-lg bg-pink-400 px-5 py-3 text-lg font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
                    :disabled="!canContinueMood" @click="nextStep">
                    Siguiente
                </button>
            </div>

            <div v-else-if="step === 3" class="flex flex-col gap-5">
                <h2 class="text-2xl font-bold text-pink-400">Elige que hacemos</h2>
                <p class="text-pink-300">Puedes elegir varios.</p>
                <div class="grid gap-3 grid-cols-2">
                    <button v-for="plan in filteredPlans" :key="plan.id" type="button"
                        class="flex flex-col min-h-36 items-center gap-4 rounded-lg border p-4 text-left transition"
                        :class="selectedPlans.includes(plan.id) ? 'border-pink-400 bg-pink-100' : 'border-pink-200 bg-white'"
                        @click="togglePlan(plan.id)">
                        <img :src="plan.image" :alt="plan.title" class="size-20 shrink-0 object-contain">
                        <span class="text-xl font-bold text-pink-400">{{ plan.title }}</span>
                    </button>
                </div>

                <button type="button"
                    class="rounded-lg bg-pink-400 px-5 py-3 text-lg font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
                    :disabled="!canFinish" @click="continueFromPlans">
                    Siguiente
                </button>
            </div>

            <div v-else-if="step === 4 && dinnerSelected" class="flex flex-col gap-5">
                <h2 class="text-2xl font-bold text-pink-400">¿Quieres comer algo en especial?</h2>
                <div class="grid gap-3 grid-cols-2">
                    <button v-for="food in foodOptions" :key="food.id" type="button"
                        class="flex min-h-28 flex-col items-center justify-center gap-2 rounded-lg border p-4 text-left transition"
                        :class="selectedFood === food.id ? 'border-pink-400 bg-pink-100' : 'border-pink-200 bg-white'"
                        @click="selectedFood = food.id">
                        <component v-if="food.icon" :is="food.icon" class="size-8 text-pink-400" />
                        <span class="text-xl font-bold text-pink-400">{{ food.title }}</span>
                    </button>
                </div>

                <button type="button"
                    class="rounded-lg bg-pink-400 px-5 py-3 text-lg font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
                    :disabled="!canContinueFood" @click="nextStep">
                    Siguiente
                </button>
            </div>

            <div v-else-if="(step === 4 && !dinnerSelected) || (step === 5 && dinnerSelected)"
                class="flex flex-col gap-5">
                <label class="flex flex-col gap-2 text-pink-300">
                    <span class="text-lg font-bold">¿Algo que tenga que saber jum?</span>
                    <textarea v-model="pickupNote" rows="5"
                        class="resize-none rounded-lg border border-pink-200 px-4 py-3 text-pink-400 outline-none placeholder:text-pink-200 focus:border-pink-400" />
                </label>

                <button type="button"
                    class="mt-2 rounded-lg bg-pink-400 px-5 py-3 text-lg font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
                    @click="finishPlanner">
                    Confirmar cita
                </button>
            </div>

            <div v-else class="grid min-h-[58vh] place-items-center text-center">
                <div class="flex max-w-xl flex-col items-center gap-5">
                    <p class="text-sm font-bold uppercase text-pink-300">Al toque</p>
                    <h1 class="text-4xl font-bold text-pink-400">Agradecido que dijeras que SI. dsajdjad</h1>
                    <p class="text-lg text-pink-300">
                        {{ selectedDate }}.
                        <span v-if="selectedPlanMoodInfo">Mood: {{ selectedPlanMoodInfo.title }}.</span>
                        <span v-if="selectedPlanInfos.length">
                            Plan: {{selectedPlanInfos.map((plan) => plan.title).join(' + ')}}.
                        </span>
                        <span v-if="selectedFoodInfo">Comida: {{ selectedFoodInfo.title }}.</span>
                    </p>
                    <p v-if="pickupNote" class="rounded-lg bg-pink-50 px-4 py-3 text-pink-300">{{ pickupNote }}</p>
                    <img :src="hamsterFinal" alt="Imagen de cita" class="size-36 object-contain ">
                </div>
            </div>
        </section>
    </section>
</template>

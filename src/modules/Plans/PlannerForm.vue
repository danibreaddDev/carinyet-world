<script setup lang="ts">
import { usePlanner } from './usePlanner.ts';
import PizzaIcon from '@iconify-vue/mdi/pizza';
import BurgerIcon from '@iconify-vue/mdi/hamburger';
import PastaIcon from '@iconify-vue/mdi/pasta';
import NoodlesIcon from '@iconify-vue/mdi/noodles';
import SushiFilledIcon from '@iconify-vue/boxicons/sushi-filled';
import FoodIcon from '@iconify-vue/mdi/food';
import hamsterQuestion from '/assets/planner/Hamster_question.webp';
import hamsterFinal from '/assets/planner/Hamster_final.webp';
import ArrowLeftCircleIcon from '@iconify-vue/mdi/arrow-left-circle';

const {
    planMoods,
    foodOptions,
    noHoverMessages,
    step,
    noPosition,
    noEscaped,
    noHoverMessageIndex,
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
} = usePlanner();

const foodIcons: Record<string, any> = {
    pizza: PizzaIcon,
    sushi: SushiFilledIcon,
    burguer: BurgerIcon,
    pasta: PastaIcon,
    ramen: NoodlesIcon,
    otro: FoodIcon,
};
</script>

<template>
    <section class="flex flex-col gap-5">
        <RouterLink to="/plans" class="text-pink-200 border p-2 bg-pink-200 rounded-full w-fit">
            <ArrowLeftCircleIcon class="text-pink-400 size-8" />
        </RouterLink>
        <div>
            <div v-if="step === 0" class="grid place-items-center">
                <section
                    class="w-full rounded-lg border border-pink-200 bg-white p-6 text-center flex flex-col shadow-sm">
                    <h1 class="text-4xl font-bold text-pink-400">Xoxete, se vem un rato?</h1>
                    <img :src="hamsterQuestion" alt="date" class="size-32 self-center" />

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
                            class="rounded-lg border border-pink-200 bg-white px-8 py-3 text-lg font-bold text-pink-300 shadow-sm transition"
                            :class="{ 'md:fixed': noEscaped }"
                            :style="noEscaped ? { left: `${noPosition.x}px`, top: `${noPosition.y}px` } : undefined"
                            @click="openNoDialog" @mouseenter="moveNoButton" @focus="moveNoButton">
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
                        class="rounded-lg border border-pink-200 px-4 py-2 font-bold text-pink-300"
                        @click="previousStep">
                        Atras
                    </button>
                </div>

                <div v-if="step === 1" class="flex flex-col gap-5">
                    <label class="flex flex-col gap-2 text-pink-300">
                        <span class="text-lg font-bold">Día</span>
                        <input v-model="selectedDate" type="date"
                            class="rounded-lg border border-pink-200 px-4 py-3 text-pink-400 outline-none focus:border-pink-400" />
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
                            <img :src="mood.image" :alt="mood.title" class="size-24" />
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
                            <img :src="plan.image" :alt="plan.title" class="size-20 shrink-0 object-contain" />
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
                            <component v-if="foodIcons[food.id]" :is="foodIcons[food.id]"
                                class="size-8 text-pink-400" />
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
                            class="resize-none rounded-lg border border-pink-200 px-4 py-3 text-pink-400 outline-none placeholder:text-pink-200 focus:border-pink-400"></textarea>
                    </label>

                    <button type="button"
                        class="mt-2 rounded-lg bg-pink-400 px-5 py-3 text-lg font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
                        :disabled="isSubmitting" @click="submitPlanner">
                        {{ isSubmitting ? 'Guardando...' : 'Confirmar cita' }}
                    </button>

                    <p v-if="submitError" class="text-sm font-bold text-red-500">{{ submitError }}</p>
                </div>

                <div v-else class="grid min-h-[58vh] place-items-center text-center">
                    <div class="flex max-w-xl flex-col items-center gap-5">
                        <p class="text-sm font-bold uppercase text-pink-300">Al toque</p>
                        <h1 class="text-4xl font-bold text-pink-400">Agradecido que dijeras que SI. dsajdjad</h1>
                        <p class="text-lg text-pink-300">
                            {{ selectedDate }}.
                            <span v-if="selectedPlanMoodInfo">Mood: {{ selectedPlanMoodInfo.title }}.</span>
                            <span v-if="selectedPlanInfos.length">Plan: {{selectedPlanInfos.map((plan) =>
                                plan.title).join(' + ')}}.</span>
                            <span v-if="selectedFoodInfo">Comida: {{ selectedFoodInfo.title }}.</span>
                        </p>
                        <p v-if="pickupNote" class="rounded-lg bg-pink-50 px-4 py-3 text-pink-300">{{ pickupNote }}</p>
                        <img :src="hamsterFinal" alt="Imagen de cita" class="size-36 object-contain" />
                    </div>
                </div>
            </section>

            <transition name="fade">
                <div v-if="showNoDialog" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div
                        class="mx-auto w-full max-w-sm overflow-hidden rounded-3xl bg-white p-6 text-center shadow-2xl">
                        <img src="/assets/planner/noImage.png" alt="Dialogo" class="rounded-2xl mx-auto" />
                        <p class="text-2xl font-bold text-pink-400">¿Cómo que no? ts</p>
                        <button type="button"
                            class="mt-6 rounded-full bg-pink-400 px-6 py-3 text-white hover:bg-pink-500"
                            @click="closeNoDialog">
                            Vale
                        </button>
                    </div>
                </div>
            </transition>
        </div>
    </section>
</template>

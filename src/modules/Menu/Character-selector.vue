<script setup lang="ts">
import { ref, watch } from 'vue';
import ArrowRight from "@iconify-vue/mdi/arrow-right"
import cinamonrollImg from '../../../public/assets/character-selector/Cinamonroll.jfif';
import hellokittyImg from '../../../public/assets/character-selector/Hellokitty.jfif';
import kuromiImg from '../../../public/assets/character-selector/Kuromi.jfif';
import lalaImg from '../../../public/assets/character-selector/Lala.jfif';
import kikiImg from '../../../public/assets/character-selector/Kiki.jfif';
import mymelodyImg from '../../../public/assets/character-selector/Mymelody.jfif';
import pochaccoImg from '../../../public/assets/character-selector/Pochacco.jfif';
import pompurinImg from '../../../public/assets/character-selector/Pompurin.jfif';
import kuromiActivatedImg from '../../../public/assets/character-selector/KuromiActivated.jpg';
import gudetamaImg from '../../../public/assets/character-selector/Gudetama.png';


type Character = {
    id: string;
    image: string;
    activeImage?: string;
};

const characters: Character[] = [
    { id: 'kuromi', image: kuromiImg, activeImage: kuromiActivatedImg },
    { id: 'mymelody', image: mymelodyImg },
    { id: 'hellokitty', image: hellokittyImg },
    { id: 'cinamonroll', image: cinamonrollImg },
    { id: 'pompurin', image: pompurinImg },
    { id: 'pochacco', image: pochaccoImg },
    { id: 'lala', image: lalaImg },
    { id: 'kiki', image: kikiImg },
    { id: 'gudetama', image: gudetamaImg },
];
const emit = defineEmits<{
    (e: 'characterSelected', characterId: string): void;
}>();
const selectedCharacterId = ref<string | null>(null);

watch(selectedCharacterId, (newValue, oldValue) => {
    console.log('selectedCharacterId changed:', { oldValue, newValue });
});
const selectCharacter = (characterId: string | null) => {
    console.log(characterId);
    if (characterId) {
        emit('characterSelected', characterId);
    }
}

</script>
<template>
    <section class="flex flex-col gap-5 items-center">
        <div class="grid grid-cols-3">
            <div v-for="character in characters" :key="character.id"
                :style="{ backgroundImage: `url(${selectedCharacterId === character.id ? character.activeImage ?? character.image : character.image})` }"
                class="bg-cover bg-center size-28 -outline-offset-4 transition cursor-pointer"
                :class="selectedCharacterId === character.id ? 'outline-4 outline-pink-400' : 'outline-0'" role="button"
                tabindex="0" @click="selectedCharacterId = character.id"
                @keydown.enter="selectedCharacterId = character.id"
                @keydown.space.prevent="selectedCharacterId = character.id">
            </div>
        </div>
        <button @click="selectCharacter(selectedCharacterId)" :disabled="!selectedCharacterId"
            class=" disabled:bg-pink100 disabled:border-pink-200 enabled:bg-pink-300 text-white px-8 py-2 rounded">
            <ArrowRight class="size-16" />
        </button>
    </section>
</template>

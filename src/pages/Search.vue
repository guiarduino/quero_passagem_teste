
<script setup lang="ts">
import { ref } from 'vue';
import TopSearch from '@/components/TopSearch.vue';
import TravelFind from '@/components/TravelFind.vue';

// Cria uma ref para acessar métodos do TravelFind
const travelFindRef = ref();

// Função chamada quando TopSearch emitir o evento 'buscar'
function onBuscar() {
  travelFindRef.value?.findTravels();
}
</script>

<template>
  <div>
    <TopSearch @buscar="onBuscar" />
  </div>
  <div class="p-8 pl-40 w-[80%]">
     <TravelFind ref="travelFindRef" />
  </div>
</template>
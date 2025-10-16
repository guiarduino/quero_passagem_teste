
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { CalendarDate } from '@internationalized/date';
import TopSearch from '@/components/TopSearch.vue';
import TravelFind from '@/components/TravelFind.vue';

const travelFindRef = ref();
const route = useRoute();

function onBuscar(payload) {
  travelFindRef.value?.findTravels(payload);
}

onMounted(() => {
  const { selectedPlace, selectedDestination, selectedDate } = route.query;
  if (selectedPlace && selectedDestination && selectedDate) {
    let dateObj: CalendarDate | undefined;
    if (typeof selectedDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(selectedDate)) {
      const [year, month, day] = selectedDate.split('-').map(Number);
      dateObj = new CalendarDate(year, month, day);
    }
    onBuscar({
      selectedPlace,
      selectedDestination,
      selectedDate: dateObj
    });
  }
});
</script>

<template>
  <div>
    <TopSearch @buscar="onBuscar" />
  </div>
  <div class="p-8 pl-40 w-[80%]">
     <TravelFind ref="travelFindRef" />
  </div>
</template>
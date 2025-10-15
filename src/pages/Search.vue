<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';

import TopSearch from '@/components/TopSearch.vue';
import TravelFind from '@/components/TravelFind.vue';

</script>

<template>
  <div>
    <TopSearch />
  </div>
  <div class="p-8 pl-40 w-[80%]">
     <TravelFind />
  </div>
</template>
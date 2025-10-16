<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, defineEmits } from 'vue';
import api from '@/services/api'
import Button from '@/components/ui/button/Button.vue';
import Calendar from '@/components/ui/calendar/Calendar.vue';
import Popover from '@/components/ui/popover/Popover.vue';
import PopoverContent from '@/components/ui/popover/PopoverContent.vue';
import PopoverTrigger from '@/components/ui/popover/PopoverTrigger.vue';
import { cn } from '@/lib/utils';
import { CalendarIcon, Search } from 'lucide-vue-next';
import { CalendarDate } from '@internationalized/date';

import {
  DateFormatter,
  getLocalTimeZone,
} from "@internationalized/date"
import { DateValue } from 'reka-ui';

const df = new DateFormatter("PT-br", {
  dateStyle: "short",
})

type Cities = {
  id: number,
  name: String,
  type: String,
  url: String
}

const cities = ref<Cities[]>([]);
const selectedPlace = ref(null)
const selectedDestination = ref(null)
const searchPlace = ref('')
const searchDestination = ref('')
const showPlace = ref(false)
const showDestination = ref(false)
const showCalendar = ref(false)

// Referências para os inputs
const partidaRef = ref(null)
const destinoRef = ref(null)
const selectedDate = ref<DateValue>()
const today = new CalendarDate(
  new Date().getFullYear(),
  new Date().getMonth() + 1,
  new Date().getDate()
)

const emit = defineEmits(['buscar'])

function normalize(str: string) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

// Filtra cidades conforme busca
const filteredPartida = computed(() =>
  cities.value.filter(c =>
    normalize(String(c.name)).includes(normalize(searchPlace.value))
  )
)
const filteredDestino = computed(() =>
  cities.value.filter(c =>
    normalize(String(c.name)).includes(normalize(searchDestination.value))
  )
)

function selectPartida(cidade) {
  selectedPlace.value = cidade.id
  searchPlace.value = cidade.name
  showPlace.value = false
}

function selectDestino(cidade) {
  selectedDestination.value = cidade.id
  searchDestination.value = cidade.name
  showDestination.value = false
}

function handleClickOutside(e) {
  if (
    partidaRef.value && !partidaRef.value.contains(e.target)
  ) {
    showPlace.value = false
  }
  if (
    destinoRef.value && !destinoRef.value.contains(e.target)
  ) {
    showDestination.value = false
  }
}

onMounted(async() => {
  document.addEventListener('click', handleClickOutside)

  try {
    await api.trips.getTrips().then(res => {
      cities.value = res
    });
  } catch (err) {
    console.warn('Falha ao buscar trips da API, usando dados locais de fallback', err)
  }
})

function handleFind() {
  if (!selectedPlace.value || !selectedDestination.value) {
    alert('Por favor, selecione as cidades de partida e destino.')
    return
  }
  if (selectedPlace.value === selectedDestination.value) {
    alert('As cidades de partida e destino não podem ser iguais.')
    return
  }

  if (!selectedDate.value) {
    alert('Por favor, selecione uma data de saída.')
    return
  }

  // Só permitir busca se o nome da cidade de partida ou destino contiver "PR" ou "SP"
  const partidaOk = /\b(PR|SP)\b/i.test(String(searchPlace.value))
  const destinoOk = /\b(PR|SP)\b/i.test(String(searchDestination.value))
  if (!partidaOk || !destinoOk) {
    alert('Só é possível buscar viagens para cidades dos estados do PR ou SP')
    return
  }

  emit('buscar')
  
}

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

watch(selectedDate, (newVal) => {
  if (newVal) showCalendar.value = false
})

</script>

<template>
    <!-- Top menu search bar -->
    <div class="search-bar content-wrapper top-0 left-0 w-full z-50 bg-blue-900 p-4 flex justify-center items-center shadow-md">
      <div class="flex items-center space-x-4 px-4">
        <!-- Partindo de -->
        <div ref="partidaRef" class="relative bg-white text-black rounded-sm px-4 py-1 h-12 flex items-center">
          <p class="text-xs text-gray-500 font-semibold mb-1">Partindo de</p>
          <input
            type="text"
            v-model="searchPlace"
            placeholder="Digite a cidade"
            class="w-full px-3 py-2 border rounded-md border-0 outline-none h-full"
            @focus="showPlace = true"
          />
          <ul
            v-if="showPlace && filteredPartida.length"
            class="absolute left-0 top-full mt-1 right-0 mt-1 bg-white border rounded max-h-40 overflow-y-auto z-10"
          >
            <li
              v-for="cidade in filteredPartida"
              :key="cidade.id"
              @click="selectPartida(cidade)"
              class="px-3 py-2 hover:bg-blue-100 cursor-pointer"
            >
              {{ cidade.name }}
            </li>
          </ul>
        </div>
        <button class="bg-white border-none rounded-full w-10 h-10 flex items-center justify-center cursor-pointer">
          <span class="text-lg">&#8644;</span>
        </button>
        <!-- Indo para -->
        <div ref="destinoRef" class="relative bg-white text-black rounded-sm px-4 py-1 h-12 flex items-center">
          <p class="text-xs text-gray-500 font-semibold mb-1">Indo para</p>
          <input
            type="text"
            v-model="searchDestination"
            placeholder="Digite a cidade"
            class="w-full px-3 py-2 border rounded-md border-0   outline-none h-full"
            @focus="showDestination = true"
          />
          <ul
            v-if="showDestination && filteredDestino.length"
            class="absolute top-full left-0 right-0 mt-1 bg-white border rounded max-h-40 overflow-y-auto z-10"
          >
            <li
              v-for="cidade in filteredDestino"
              :key="cidade.id"
              @click="selectDestino(cidade)"
              class="px-3 py-2 hover:bg-blue-100 cursor-pointer"
            >
              {{ cidade.name }}
            </li>
          </ul>
        </div>
        <!-- Data Saída -->
        <div class="bg-white text-black rounded-sm px-4 py-1 h-12 w-60 flex items-center">
          <p class="text-xs text-gray-500 font-semibold mb-1">Data Saída</p>
          <Popover v-model:open="showCalendar">
            <PopoverTrigger as-child>
              <Button
                variant="gosth"
                :class="cn(
                  'w-[280px] justify-start text-left font-normal h-full',
                  !selectedDate && 'text-muted-foreground',
                )"
              >
                <CalendarIcon class="mr-2 h-4 w-4" />
                {{ selectedDate ? df.format(selectedDate.toDate(getLocalTimeZone())) : "Selecione uma data" }}
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-auto p-0">
              <Calendar v-model="selectedDate" locale="pt-BR" initial-focus :minValue="today" />
            </PopoverContent>
          </Popover>
        </div>
        <Button class="bg-blue-500 text-white px-4 py-2 w-25 flex items-center justify-center rounded-md cursor-pointer hover:bg-blue-700 h-12"
            @click="handleFind()">
          <Search />
        </Button>
      </div>
    </div>

</template>
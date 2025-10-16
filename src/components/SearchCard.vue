<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter } from 'vue-router'
import { CalendarIcon } from 'lucide-vue-next'
import api from '@/services/api'
import Button from '@/components/ui/button/Button.vue'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { DateValue } from 'reka-ui'
import { CalendarDate } from '@internationalized/date';
import {useToast} from 'vue-toast-notification';

import {
  DateFormatter,
  getLocalTimeZone,
} from "@internationalized/date"

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

const toast = useToast();
const router = useRouter();

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

// Filtra cidades conforme busca
const filteredPartida = computed(() =>
  cities.value.filter(c =>
    c.name.toLowerCase().includes(searchPlace.value.toLowerCase())
  )
)
const filteredDestination = computed(() =>
  cities.value.filter(c =>
    c.name.toLowerCase().includes(searchDestination.value.toLowerCase())
  )
)

function selectPlace(cidade) {
  selectedPlace.value = cidade.id
  searchPlace.value = cidade.name
  showPlace.value = false
}

function selectDestination(cidade) {
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

function handleFind() {
  if (!selectedPlace.value || !selectedDestination.value) {
    toast.warning('Por favor, selecione as cidades de partida e destino.')
    return
  }
  if (selectedPlace.value === selectedDestination.value) {
    toast.warning('As cidades de partida e destino não podem ser iguais.')
    return
  }
  if (!selectedDate.value) {
    toast.warning('Por favor, selecione uma data de saída.');
    return
  }
  // Só permitir busca se o nome da cidade de partida ou destino contiver "PR" ou "SP"
  const partidaOk = /\b(PR|SP)\b/i.test(String(searchPlace.value))
  const destinoOk = /\b(PR|SP)\b/i.test(String(searchDestination.value))
  if (!partidaOk || !destinoOk) {
    toast.warning('Só é possível buscar viagens para cidades dos estados do PR ou SP');
    return
  }
  // Navega para Onibus.vue passando os dados via query params
  router.push({
    name: 'Onibus',
    query: {
      selectedPlace: selectedPlace.value,
      selectedDestination: selectedDestination.value,
      selectedDate: selectedDate.value ? selectedDate.value.toString() : ''
    }
  });
}

onMounted(async() => {
  document.addEventListener('click', handleClickOutside)

  try {
    await api.trips.getTrips().then(res => {
      cities.value = res
    });
  } catch (err) {
    toast.warning('Falha ao buscar trips da API, usando dados locais de fallback', err)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

watch(selectedDate, (newVal) => {
  if (newVal) showCalendar.value = false
})

</script>

<template>
  <div class="bg-[#0f2147] rounded-2xl p-6 w-full max-w-md mx-auto text-white shadow-lg">
    <h2 class="text-center text-lg font-semibold mb-4">
      Encontre a sua passagem de ônibus!
    </h2>

    <!-- Partindo de -->
    <div ref="partidaRef" class="bg-white text-black rounded-xl px-4 py-1 mb-2 relative">
      <p class="text-xs text-gray-500 font-semibold mb-1">Partindo de</p>
      <input
        type="text"
        v-model="searchPlace"
        placeholder="Digite a cidade de partida"
        class="w-full px-3 py-2 border rounded border-0 outline-none"
        @focus="showPlace = true"
      />
      <ul
        v-if="showPlace && filteredPartida.length"
        class="absolute left-0 right-0 mt-1 bg-white border rounded max-h-40 overflow-y-auto z-10"
      >
        <li
          v-for="cidade in filteredPartida"
          :key="cidade.id"
          @click="selectPlace(cidade)"
          class="px-3 py-2 hover:bg-blue-100 cursor-pointer"
        >
          {{ cidade.name }}
        </li>
      </ul>
    </div>

    <!-- Indo para -->
    <div ref="destinoRef" class="bg-white text-black rounded-xl px-4 py-1 mb-2 relative">
      <p class="text-xs text-gray-500 font-semibold mb-1">Indo para</p>
      <input
        type="text"
        v-model="searchDestination"
        placeholder="Digite a cidade de destino"
        class="w-full px-3 py-2 border rounded border-0 outline-none"
        @focus="showDestination = true"
      />
      <ul
        v-if="showDestination && filteredDestination.length"
        class="absolute left-0 right-0 mt-1 bg-white border rounded max-h-40 overflow-y-auto z-10"
      >
        <li
          v-for="cidade in filteredDestination"
          :key="cidade.id"
          @click="selectDestination(cidade)"
          class="px-3 py-2 hover:bg-blue-100 cursor-pointer"
        >
          {{ cidade.name }}
        </li>
      </ul>
    </div>

    <!-- Data Saída -->
    <div class="bg-white text-black rounded-xl px-4 py-1 mb-2 relative">
      <p class="text-xs text-gray-500 font-semibold mb-1">Data Saída</p>
      <Popover v-model:open="showCalendar">
        <PopoverTrigger as-child>
          <Button
            variant="gosth"
            :class="cn(
              'w-[280px] justify-start text-left font-normal',
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

    <!-- Buscar -->
    <Button class="mt-4 w-full bg-blue-600 hover:bg-blue-700 rounded-full py-3 text-white font-bold tracking-wide"
        @click="handleFind()">
      BUSCAR PASSAGEM
    </Button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
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

const cidades = [
  { label: 'Ourinhos', value: 'ourinhos' },
  { label: 'Curitiba', value: 'curitiba' },
  { label: 'São Paulo', value: 'sp' },
  { label: 'Rio de Janeiro', value: 'rj' },
]

const selectedPartida = ref(null)
const selectedDestino = ref(null)
const searchPartida = ref('')
const searchDestino = ref('')
const showPartida = ref(false)
const showDestino = ref(false)
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
  cidades.filter(c =>
    c.label.toLowerCase().includes(searchPartida.value.toLowerCase())
  )
)
const filteredDestino = computed(() =>
  cidades.filter(c =>
    c.label.toLowerCase().includes(searchDestino.value.toLowerCase())
  )
)

function selectPartida(cidade) {
  selectedPartida.value = cidade.value
  searchPartida.value = cidade.label
  showPartida.value = false
}

function selectDestino(cidade) {
  selectedDestino.value = cidade.value
  searchDestino.value = cidade.label
  showDestino.value = false
}

function handleClickOutside(e) {
  if (
    partidaRef.value && !partidaRef.value.contains(e.target)
  ) {
    showPartida.value = false
  }
  if (
    destinoRef.value && !destinoRef.value.contains(e.target)
  ) {
    showDestino.value = false
  }
}

function handleFind() {
  if (!selectedPartida.value || !selectedDestino.value) {
    alert('Por favor, selecione as cidades de partida e destino.')
    return
  }
  if (selectedPartida.value === selectedDestino.value) {
    alert('As cidades de partida e destino não podem ser iguais.')
    return
  }
  alert(`Buscando passagem de ${searchPartida.value} para ${searchDestino.value} na data ${selectedDate.value}`)
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

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
            v-model="searchPartida"
            placeholder="Curitiba, PR - Rodoviária"
            class="w-full px-3 py-2 border rounded-md border-0 outline-none h-full"
            @focus="showPartida = true"
          />
          <ul
            v-if="showPartida && filteredPartida.length"
            class="absolute left-0 top-full mt-1 right-0 mt-1 bg-white border rounded max-h-40 overflow-y-auto z-10"
          >
            <li
              v-for="cidade in filteredPartida"
              :key="cidade.value"
              @click="selectPartida(cidade)"
              class="px-3 py-2 hover:bg-blue-100 cursor-pointer"
            >
              {{ cidade.label }}
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
            v-model="searchDestino"
            placeholder="Ourinhos, SP"
            class="w-full px-3 py-2 border rounded-md border-0   outline-none h-full"
            @focus="showDestino = true"
          />
          <ul
            v-if="showDestino && filteredDestino.length"
            class="absolute top-full left-0 right-0 mt-1 bg-white border rounded max-h-40 overflow-y-auto z-10"
          >
            <li
              v-for="cidade in filteredDestino"
              :key="cidade.value"
              @click="selectDestino(cidade)"
              class="px-3 py-2 hover:bg-blue-100 cursor-pointer"
            >
              {{ cidade.label }}
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
        <button class="bg-blue-500 text-white px-4 py-2 w-25 flex items-center justify-center rounded-md cursor-pointer hover:bg-blue-700 h-12">
          <Search />
        </button>
      </div>
    </div>

</template>
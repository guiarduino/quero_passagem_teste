<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { CalendarIcon } from 'lucide-vue-next'
import Button from '@/components/ui/button/Button.vue'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { DateValue } from 'reka-ui'

import {
  DateFormatter,
  getLocalTimeZone,
} from "@internationalized/date"

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
  <div class="bg-[#0f2147] rounded-2xl p-6 w-full max-w-md mx-auto text-white shadow-lg">
    <h2 class="text-center text-lg font-semibold mb-4">
      Encontre a sua passagem de ônibus!
    </h2>

    <!-- Partindo de -->
    <div ref="partidaRef" class="bg-white text-black rounded-xl px-4 py-1 mb-2 relative">
      <p class="text-xs text-gray-500 font-semibold mb-1">Partindo de</p>
      <input
        type="text"
        v-model="searchPartida"
        placeholder="Digite a cidade de partida"
        class="w-full px-3 py-2 border rounded border-0 outline-none"
        @focus="showPartida = true"
      />
      <ul
        v-if="showPartida && filteredPartida.length"
        class="absolute left-0 right-0 mt-1 bg-white border rounded max-h-40 overflow-y-auto z-10"
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

    <!-- Indo para -->
    <div ref="destinoRef" class="bg-white text-black rounded-xl px-4 py-1 mb-2 relative">
      <p class="text-xs text-gray-500 font-semibold mb-1">Indo para</p>
      <input
        type="text"
        v-model="searchDestino"
        placeholder="Digite a cidade de destino"
        class="w-full px-3 py-2 border rounded border-0 outline-none"
        @focus="showDestino = true"
      />
      <ul
        v-if="showDestino && filteredDestino.length"
        class="absolute left-0 right-0 mt-1 bg-white border rounded max-h-40 overflow-y-auto z-10"
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
          <Calendar v-model="selectedDate" locale="pt-BR" initial-focus />
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

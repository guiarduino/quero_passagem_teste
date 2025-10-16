<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import { Spinner } from '@/components/ui/spinner';
import api from '@/services/api'
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, ChevronDown, ChevronUp } from 'lucide-vue-next';
import {useToast} from 'vue-toast-notification';
import {
  DateFormatter,
  getLocalTimeZone,
} from "@internationalized/date"

const toast = useToast();

type TravelData = {
  id: string,
  arrival: {
    date: string,
    time: string
  },
  departure: {
    date: string,
    time: string
  },
  seatClass: string,
  to: {
    id: string,
    name: string
  },
  from: {
    id: string,
    name: string
  },
  price: {
    seatPrice: number,
    taxPrice: number,
    price: number
  },
  company: {
    id: number,
    name: string,
    logo: {
      svg: string,
      jpg: string
    },
    phone: string,
    cnpj: string,
    description: any
  },
  travelDuration: number
  busData: {
    orientation: string,
    floor: number,
    seatsLayout: string,
    seats: {
      seat?: string,
      position: {
        x: number,
        y: number,
        z: number,
      };
      occupied?: boolean,
      type: string,
    }[][]
  }[]
}

const isExpanded = ref<Record<string, boolean>>({});
const selectedSeats = ref([]);
const cardsData = ref<TravelData[]>([]);
const isLoading = ref(false);

const df = new DateFormatter("EN-us", {
  dateStyle: "short",
})

const toggleExpand = (cardId: string) => {
  if(isExpanded.value[cardId] !== true){
    isExpanded.value[cardId] = true;
  }
};

function formatHourMinute(time: string): string {
  if (!time) return '';
  const parts = time.split(':');
  return parts.length >= 2 ? `${parts[0]}:${parts[1]}` : time;
}

function formatDurationMinutes(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}min`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${minutes}min`;
    }
}

const handleSeatClick = (seatNumber: string) => {
  const index = selectedSeats.value.indexOf(seatNumber)
  if (index > -1) {
    selectedSeats.value.splice(index, 1)
  } else {
    selectedSeats.value.push(seatNumber)
  }
}

const getSeatClass = (seatData: any) => {
  if (seatData.type === "emptyOrReservedSpace") {
    return ""
  }
  
  const isOccupied = seatData.occupied ?? false;
  const isSelected = selectedSeats.value.includes(seatData.seat)
  
  if (isOccupied) {
    return "w-12 h-12 rounded-lg bg-gray-200 text-gray-500 text-sm font-semibold cursor-not-allowed"
  } else if (isSelected) {
    return "w-12 h-12 rounded-lg bg-blue-600 text-white border-2 border-blue-600 text-sm font-semibold transition-colors"
  } else {
    return "w-12 h-12 rounded-lg bg-white border border-gray-300 hover:border-blue-500 text-sm font-semibold transition-colors"
  }
}

onMounted(async () => {
  // Inicializar estados padrão
  cardsData.value.forEach(card => {
    isExpanded.value[card.id] = false;
  });
});

async function findTravels(data: { selectedPlace: string; selectedDestination: string; selectedDate: any }) {
  
  try {
    isLoading.value = true;
    let dateObj = data.selectedDate.toDate(getLocalTimeZone());
    let travelDate = `${dateObj.getFullYear()}-${String(dateObj.getMonth()+1).padStart(2,'0')}-${String(dateObj.getDate()).padStart(2,'0')}`;
    let payload = {
      to: data.selectedDestination,
      from: data.selectedPlace,
      travelDate
    }
    await api.trips.findTrips(payload).then(res => {
      // Ordena por departure.date, departure.time e travelDuration crescente
      cardsData.value = res.sort((a: TravelData, b: TravelData) => {
        const dateA = `${a.departure.date} ${a.departure.time}`;
        const dateB = `${b.departure.date} ${b.departure.time}`;
        const diff = new Date(dateA).getTime() - new Date(dateB).getTime();
        if (diff !== 0) return diff;
        return a.travelDuration - b.travelDuration;
      });
    });
  } catch (err) {
    toast.warning('Falha ao buscar trips da API, usando dados locais de fallback', err)
  } finally {
    isLoading.value = false;
  }
}

defineExpose({
  findTravels
})

</script>

<template>
  <h1 class="text-2xl font-bold mb-4">Resultados da Busca</h1>
  <p class="text-gray-600">{{ cardsData.length }} passagens encontradas</p>

  <div v-if="isLoading" class="flex justify-center items-center py-10">
    <Spinner class="size-8" />
    <p class="ml-4 text-gray-600">Carregando...</p>
  </div>

  <div v-else>
    <div v-for="card in cardsData" :key="card.id">
    <Card 
      class="mt-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
      @click="toggleExpand(card.id)"
    >
      <CardContent class="p-6">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <!-- Coluna esquerda: logo e horários -->
          <div class="flex items-center gap-4 min-w-0 lg:w-64">
            <img :src="card.company.logo.jpg" alt="Princesa" class="h-12 w-30 object-contain flex-shrink-0" />
            <div class="flex flex-col min-w-0">
              <div class="flex items-center gap-2 text-xl font-bold whitespace-nowrap">
                <span>{{ formatHourMinute(card.departure.time) }}</span>
                <span class="text-gray-400">→</span>
                <span>{{ formatHourMinute(card.arrival.time) }}</span>
              </div>
              <p class="text-sm text-gray-500">Duração: {{ formatDurationMinutes(card.travelDuration) }}</p>
            </div>
          </div>

          <!-- Coluna central: origem e destino -->
          <div class="flex flex-col gap-2 text-sm text-gray-700 lg:flex-1 lg:mx-6">
            <div class="flex items-center gap-2">
              <MapPin class="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span class="truncate">De: {{ card.from.name }}</span>
            </div>
            <div class="flex items-center gap-2">
              <MapPin class="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span class="truncate">Para: {{ card.to.name }}</span>
            </div>
          </div>

          <!-- Coluna direita: tipo, preço e botão -->
          <div class="flex flex-col sm:flex-row sm:items-center gap-4 lg:gap-6">
            <div class="flex flex-col items-start sm:items-end text-left sm:text-right">
              <p class="text-xs font-medium text-gray-600 uppercase tracking-wide">{{ card.seatClass }}</p>
              <p class="text-3xl font-bold text-gray-900 mt-1">R$ {{ card.price.price.toFixed(2) }}</p>
              <p class="text-xs text-gray-500">por pessoa</p>
            </div>

            <div class="flex items-center gap-3">
              <Button 
                class="bg-green-700 hover:bg-green-800 text-white font-semibold px-8 py-6 text-sm whitespace-nowrap"
                v-if="!isExpanded[card.id]"
              >
                ESCOLHER IDA
              </Button>

              <Button 
                class="bg-white text-blue-800 border-2 border-blue-800 hover:bg-blue-50 font-semibold px-8 py-6 text-sm whitespace-nowrap"
                v-if="isExpanded[card.id]"
                @click.stop="isExpanded[card.id] = false"
              >
                FECHAR
              </Button>

              <!-- Ícone de expansão -->
              <div class="flex-shrink-0">
                <ChevronDown v-if="!isExpanded[card.id]" class="w-6 h-6 text-gray-400" />
                <ChevronUp v-else class="w-6 h-6 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <!-- Conteúdo expandido -->
      <div 
        v-if="isExpanded[card.id]"
        class="px-4 pb-4 border-t border-gray-200 pt-4 animate-in fade-in slide-in-from-top-2"
      >
        <!-- Instrução -->
        <div class="flex items-center gap-2 mb-4 text-sm text-gray-700">
          <div class="w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center">
            <span class="text-xs">ⓘ</span>
          </div>
          <p>Selecione a quantidade de passageiros marcando as poltronas desejadas:</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Seletor de Assentos -->
          <div class="lg:col-span-2 rounded-2xl p-8 bg-white">
            <div class="flex gap-4">
              <!-- Volante do motorista -->
              <div class="flex flex-col justify-end pb-8">
                <svg class="w-16 h-16 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="12" cy="12" r="7"/>
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 5v3m0 8v3M5 12h3m8 0h3"/>
                </svg>
              </div>

              <!-- Área dos assentos -->
              <div class="flex-1">
                <template v-if="card.busData && card.busData.length > 0 && card.busData[0].seats">
                  <div
                    v-for="(row, rowIndex) in card.busData[0].seats"
                    :key="rowIndex"
                    class="flex gap-2 mb-2"
                  >
                    <template v-for="(seatData, seatIndex) in row" :key="seatIndex">
                      <!-- Espaço vazio -->
                      <div v-if="seatData.type === 'emptyOrReservedSpace'" class="w-12 h-12"></div>
                      <!-- Assento -->
                      <button
                        v-else
                        :class="getSeatClass(seatData)"
                        @click.stop="seatData && 'occupied' in seatData && !seatData.occupied && handleSeatClick(seatData.seat)"
                        :disabled="seatData && 'occupied' in seatData && seatData.occupied"
                      >
                        {{ seatData.seat }}
                      </button>
                    </template>
                  </div>
                </template>
                <template v-else>
                  <div class="text-gray-500">Não há dados de assentos disponíveis.</div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
    </div>
  </div>
</template>
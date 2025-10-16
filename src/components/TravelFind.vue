<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import api from '@/services/api'
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, ChevronDown, ChevronUp } from 'lucide-vue-next';

const isExpanded = ref<Record<number, boolean>>({});
const selectedSeats = ref([]);

// Dados simulados para os cards (fallback caso a API não responda)
let cardsData = [
  {
    id: 1,
    departureTime: "08:00",
    arrivalTime: "16:05",
    duration: "8h 5m",
    from: "Curitiba, PR - Rodoviária",
    to: "Ourinhos, SP",
    type: "LEITO CAMA",
    price: 298.99,
    rating: 4.8,
    directBoarding: true,
    busData: {
      orientation: "horizontal",
      floor: 0,
      seatsLayout: "numbered",
      seats: [
        [
          { seat: "03", position: { x: 0, y: 4, z: 0 }, occupied: true, type: "seat" },
          { seat: null, position: { x: 1, y: 4, z: 0 }, type: "emptyOrReservedSpace" },
          { seat: null, position: { x: 2, y: 4, z: 0 }, type: "emptyOrReservedSpace" },
          { seat: "11", position: { x: 3, y: 4, z: 0 }, occupied: false, type: "seat" },
          { seat: "15", position: { x: 4, y: 4, z: 0 }, occupied: false, type: "seat" },
          { seat: "19", position: { x: 5, y: 4, z: 0 }, occupied: true, type: "seat" },
          { seat: "23", position: { x: 6, y: 4, z: 0 }, occupied: true, type: "seat" },
          { seat: "27", position: { x: 7, y: 4, z: 0 }, occupied: false, type: "seat" },
          { seat: "31", position: { x: 8, y: 4, z: 0 }, occupied: false, type: "seat" },
          { seat: "35", position: { x: 9, y: 4, z: 0 }, occupied: false, type: "seat" },
          { seat: "40", position: { x: 10, y: 4, z: 0 }, occupied: false, type: "seat" },
          { seat: "43", position: { x: 11, y: 4, z: 0 }, occupied: false, type: "seat" }
        ],
        [
          { seat: "04", position: { x: 0, y: 3, z: 0 }, occupied: true, type: "seat" },
          { seat: null, position: { x: 1, y: 3, z: 0 }, type: "emptyOrReservedSpace" },
          { seat: null, position: { x: 2, y: 3, z: 0 }, type: "emptyOrReservedSpace" },
          { seat: "12", position: { x: 3, y: 3, z: 0 }, occupied: false, type: "seat" },
          { seat: "16", position: { x: 4, y: 3, z: 0 }, occupied: false, type: "seat" },
          { seat: "20", position: { x: 5, y: 3, z: 0 }, occupied: false, type: "seat" },
          { seat: "24", position: { x: 6, y: 3, z: 0 }, occupied: false, type: "seat" },
          { seat: "28", position: { x: 7, y: 3, z: 0 }, occupied: false, type: "seat" },
          { seat: "32", position: { x: 8, y: 3, z: 0 }, occupied: false, type: "seat" },
          { seat: "36", position: { x: 9, y: 3, z: 0 }, occupied: false, type: "seat" },
          { seat: "39", position: { x: 10, y: 3, z: 0 }, occupied: false, type: "seat" },
          { seat: "44", position: { x: 11, y: 3, z: 0 }, occupied: false, type: "seat" }
        ],
        [
          { seat: null, position: { x: 0, y: 2, z: 0 }, type: "emptyOrReservedSpace" },
          { seat: null, position: { x: 1, y: 2, z: 0 }, type: "emptyOrReservedSpace" },
          { seat: null, position: { x: 2, y: 2, z: 0 }, type: "emptyOrReservedSpace" },
          { seat: null, position: { x: 3, y: 2, z: 0 }, type: "emptyOrReservedSpace" },
          { seat: null, position: { x: 4, y: 2, z: 0 }, type: "emptyOrReservedSpace" },
          { seat: null, position: { x: 5, y: 2, z: 0 }, type: "emptyOrReservedSpace" },
          { seat: null, position: { x: 6, y: 2, z: 0 }, type: "emptyOrReservedSpace" },
          { seat: null, position: { x: 7, y: 2, z: 0 }, type: "emptyOrReservedSpace" },
          { seat: null, position: { x: 8, y: 2, z: 0 }, type: "emptyOrReservedSpace" },
          { seat: null, position: { x: 9, y: 2, z: 0 }, type: "emptyOrReservedSpace" },
          { seat: null, position: { x: 10, y: 2, z: 0 }, type: "emptyOrReservedSpace" },
          { seat: null, position: { x: 11, y: 2, z: 0 }, type: "emptyOrReservedSpace" }
        ],
        [
          { seat: "02", position: { x: 0, y: 1, z: 0 }, occupied: false, type: "seat" },
          { seat: "06", position: { x: 1, y: 1, z: 0 }, occupied: false, type: "seat" },
          { seat: "08", position: { x: 2, y: 1, z: 0 }, occupied: false, type: "seat" },
          { seat: "10", position: { x: 3, y: 1, z: 0 }, occupied: false, type: "seat" },
          { seat: "14", position: { x: 4, y: 1, z: 0 }, occupied: false, type: "seat" },
          { seat: "18", position: { x: 5, y: 1, z: 0 }, occupied: false, type: "seat" },
          { seat: "22", position: { x: 6, y: 1, z: 0 }, occupied: false, type: "seat" },
          { seat: "26", position: { x: 7, y: 1, z: 0 }, occupied: false, type: "seat" },
          { seat: "30", position: { x: 8, y: 1, z: 0 }, occupied: false, type: "seat" },
          { seat: "34", position: { x: 9, y: 1, z: 0 }, occupied: false, type: "seat" },
          { seat: "38", position: { x: 10, y: 1, z: 0 }, occupied: false, type: "seat" },
          { seat: "42", position: { x: 11, y: 1, z: 0 }, occupied: false, type: "seat" }
        ],
        [
          { seat: "01", position: { x: 0, y: 0, z: 0 }, occupied: true, type: "seat" },
          { seat: "05", position: { x: 1, y: 0, z: 0 }, occupied: false, type: "seat" },
          { seat: "07", position: { x: 2, y: 0, z: 0 }, occupied: false, type: "seat" },
          { seat: "09", position: { x: 3, y: 0, z: 0 }, occupied: false, type: "seat" },
          { seat: "13", position: { x: 4, y: 0, z: 0 }, occupied: false, type: "seat" },
          { seat: "17", position: { x: 5, y: 0, z: 0 }, occupied: false, type: "seat" },
          { seat: "21", position: { x: 6, y: 0, z: 0 }, occupied: false, type: "seat" },
          { seat: "25", position: { x: 7, y: 0, z: 0 }, occupied: false, type: "seat" },
          { seat: "29", position: { x: 8, y: 0, z: 0 }, occupied: false, type: "seat" },
          { seat: "33", position: { x: 9, y: 0, z: 0 }, occupied: false, type: "seat" },
          { seat: "37", position: { x: 10, y: 0, z: 0 }, occupied: false, type: "seat" },
          { seat: "41", position: { x: 11, y: 0, z: 0 }, occupied: false, type: "seat" }
        ]
      ]
    }
  },
  {
    id: 2,
    departureTime: "10:00",
    arrivalTime: "18:05",
    duration: "8h 5m",
    image: "https://via.placeholder.com/100x40?text=Princesa",
    from: "São Paulo, SP - Rodoviária",
    to: "Rio de Janeiro, RJ",
    type: "EXECUTIVO",
    price: 199.99,
    rating: 4.5,
    directBoarding: false,
    busData: {
      orientation: "horizontal",
      floor: 0,
      seatsLayout: "numbered",
      seats: [
    [
      { seat: "4", position: { x: 1, y: 4, z: 0 }, occupied: true, type: "seat" },
      { seat: "8", position: { x: 2, y: 4, z: 0 }, occupied: true, type: "seat" },
      { seat: "12", position: { x: 3, y: 4, z: 0 }, occupied: true, type: "seat" },
      { seat: "16", position: { x: 4, y: 4, z: 0 }, occupied: true, type: "seat" },
      { seat: "20", position: { x: 5, y: 4, z: 0 }, occupied: false, type: "seat" },
      { seat: "24", position: { x: 6, y: 4, z: 0 }, occupied: true, type: "seat" },
      { seat: "28", position: { x: 7, y: 4, z: 0 }, occupied: true, type: "seat" },
      { seat: "32", position: { x: 8, y: 4, z: 0 }, occupied: true, type: "seat" },
      { seat: "36", position: { x: 9, y: 4, z: 0 }, occupied: true, type: "seat" },
      { seat: "40", position: { x: 10, y: 4, z: 0 }, occupied: true, type: "seat" },
      { seat: "44", position: { x: 11, y: 4, z: 0 }, occupied: true, type: "seat" },
      { seat: "48", position: { x: 12, y: 4, z: 0 }, occupied: true, type: "seat" },
      { seat: "52", position: { x: 13, y: 4, z: 0 }, occupied: true, type: "seat" },
      { seat: "56", position: { x: 14, y: 4, z: 0 }, occupied: true, type: "seat" },
      { seat: "60", position: { x: 15, y: 4, z: 0 }, occupied: true, type: "seat" }
    ],
    [
      { seat: "3", position: { x: 1, y: 3, z: 0 }, occupied: true, type: "seat" },
      { seat: "7", position: { x: 2, y: 3, z: 0 }, occupied: true, type: "seat" },
      { seat: "11", position: { x: 3, y: 3, z: 0 }, occupied: true, type: "seat" },
      { seat: "15", position: { x: 4, y: 3, z: 0 }, occupied: true, type: "seat" },
      { seat: "19", position: { x: 5, y: 3, z: 0 }, occupied: true, type: "seat" },
      { seat: "23", position: { x: 6, y: 3, z: 0 }, occupied: true, type: "seat" },
      { seat: "27", position: { x: 7, y: 3, z: 0 }, occupied: true, type: "seat" },
      { seat: "31", position: { x: 8, y: 3, z: 0 }, occupied: true, type: "seat" },
      { seat: "35", position: { x: 9, y: 3, z: 0 }, occupied: true, type: "seat" },
      { seat: "39", position: { x: 10, y: 3, z: 0 }, occupied: true, type: "seat" },
      { seat: "43", position: { x: 11, y: 3, z: 0 }, occupied: true, type: "seat" },
      { seat: "47", position: { x: 12, y: 3, z: 0 }, occupied: true, type: "seat" },
      { seat: "51", position: { x: 13, y: 3, z: 0 }, occupied: true, type: "seat" },
      { seat: "55", position: { x: 14, y: 3, z: 0 }, occupied: true, type: "seat" },
      { seat: "59", position: { x: 15, y: 3, z: 0 }, occupied: true, type: "seat" }
    ],
    [
      { seat: null, position: { x: 1, y: 2, z: 0 }, type: "emptyOrReservedSpace" },
      { seat: null, position: { x: 2, y: 2, z: 0 }, type: "emptyOrReservedSpace" },
      { seat: null, position: { x: 3, y: 2, z: 0 }, type: "emptyOrReservedSpace" },
      { seat: null, position: { x: 4, y: 2, z: 0 }, type: "emptyOrReservedSpace" },
      { seat: null, position: { x: 5, y: 2, z: 0 }, type: "emptyOrReservedSpace" },
      { seat: null, position: { x: 6, y: 2, z: 0 }, type: "emptyOrReservedSpace" },
      { seat: null, position: { x: 7, y: 2, z: 0 }, type: "emptyOrReservedSpace" },
      { seat: null, position: { x: 8, y: 2, z: 0 }, type: "emptyOrReservedSpace" },
      { seat: null, position: { x: 9, y: 2, z: 0 }, type: "emptyOrReservedSpace" },
      { seat: null, position: { x: 10, y: 2, z: 0 }, type: "emptyOrReservedSpace" },
      { seat: null, position: { x: 11, y: 2, z: 0 }, type: "emptyOrReservedSpace" },
      { seat: null, position: { x: 12, y: 2, z: 0 }, type: "emptyOrReservedSpace" },
      { seat: null, position: { x: 13, y: 2, z: 0 }, type: "emptyOrReservedSpace" },
      { seat: null, position: { x: 14, y: 2, z: 0 }, type: "emptyOrReservedSpace" },
      { seat: null, position: { x: 15, y: 2, z: 0 }, type: "emptyOrReservedSpace" }
    ],
    [
      { seat: "2", position: { x: 1, y: 1, z: 0 }, occupied: true, type: "seat" },
      { seat: "6", position: { x: 2, y: 1, z: 0 }, occupied: true, type: "seat" },
      { seat: "10", position: { x: 3, y: 1, z: 0 }, occupied: false, type: "seat" },
      { seat: "14", position: { x: 4, y: 1, z: 0 }, occupied: true, type: "seat" },
      { seat: "18", position: { x: 5, y: 1, z: 0 }, occupied: true, type: "seat" },
      { seat: "22", position: { x: 6, y: 1, z: 0 }, occupied: true, type: "seat" },
      { seat: "26", position: { x: 7, y: 1, z: 0 }, occupied: true, type: "seat" },
      { seat: "30", position: { x: 8, y: 1, z: 0 }, occupied: false, type: "seat" },
      { seat: "34", position: { x: 9, y: 1, z: 0 }, occupied: true, type: "seat" },
      { seat: "38", position: { x: 10, y: 1, z: 0 }, occupied: true, type: "seat" },
      { seat: "42", position: { x: 11, y: 1, z: 0 }, occupied: true, type: "seat" },
      { seat: "46", position: { x: 12, y: 1, z: 0 }, occupied: true, type: "seat" },
      { seat: "50", position: { x: 13, y: 1, z: 0 }, occupied: true, type: "seat" },
      { seat: "54", position: { x: 14, y: 1, z: 0 }, occupied: true, type: "seat" },
      { seat: "58", position: { x: 15, y: 1, z: 0 }, occupied: true, type: "seat" }
    ],
    [
      { seat: "1", position: { x: 1, y: 0, z: 0 }, occupied: true, type: "seat" },
      { seat: "5", position: { x: 2, y: 0, z: 0 }, occupied: true, type: "seat" },
      { seat: "9", position: { x: 3, y: 0, z: 0 }, occupied: true, type: "seat" },
      { seat: "13", position: { x: 4, y: 0, z: 0 }, occupied: true, type: "seat" },
      { seat: "17", position: { x: 5, y: 0, z: 0 }, occupied: true, type: "seat" },
      { seat: "21", position: { x: 6, y: 0, z: 0 }, occupied: true, type: "seat" },
      { seat: "25", position: { x: 7, y: 0, z: 0 }, occupied: true, type: "seat" },
      { seat: "29", position: { x: 8, y: 0, z: 0 }, occupied: true, type: "seat" },
      { seat: "33", position: { x: 9, y: 0, z: 0 }, occupied: true, type: "seat" },
      { seat: "37", position: { x: 10, y: 0, z: 0 }, occupied: true, type: "seat" },
      { seat: "41", position: { x: 11, y: 0, z: 0 }, occupied: true, type: "seat" },
      { seat: "45", position: { x: 12, y: 0, z: 0 }, occupied: true, type: "seat" },
      { seat: "49", position: { x: 13, y: 0, z: 0 }, occupied: true, type: "seat" },
      { seat: "53", position: { x: 14, y: 0, z: 0 }, occupied: true, type: "seat" },
      { seat: "57", position: { x: 15, y: 0, z: 0 }, occupied: true, type: "seat" }
    ]
  ]
    }
  }
];

const toggleExpand = (cardId: number) => {
  if(isExpanded.value[cardId] !== true){
    isExpanded.value[cardId] = true;
  }
};

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
  cardsData.forEach(card => {
    isExpanded.value[card.id] = false;
  });
});

function findTravels() {
  console.log("Busca as viagens agora aew então se vc é bom memo");
}

defineExpose({
  findTravels
})

</script>

<template>
  <h1 class="text-2xl font-bold mb-4">Resultados da Busca</h1>
  <p class="text-gray-600">{{ cardsData.length }} passagens encontradas</p>

  <div v-for="card in cardsData" :key="card.id">
    <Card 
      class="mt-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
      @click="toggleExpand(card.id)"
    >
      <CardContent class="flex flex-col sm:flex-row justify-between items-center gap-4 p-4">
        <!-- Coluna esquerda: logo e horários -->
        <div class="flex items-center gap-4 w-full sm:w-auto">
          <img :src="card.image" alt="Princesa" class="h-10 object-contain" />
          <div class="flex flex-col">
            <div class="flex items-center gap-2 text-lg font-semibold">
              <span>{{ card.departureTime }}</span>
              <span class="text-gray-400">→</span>
              <span>{{ card.arrivalTime }}</span>
            </div>
            <p class="text-sm text-gray-500">Duração: {{ card.duration }}</p>
          </div>
        </div>

        <!-- Coluna central: origem e destino -->
        <div class="hidden sm:flex flex-col items-start text-sm text-gray-700">
          <div class="flex items-center gap-1">
            <MapPin class="w-4 h-4 text-gray-400" />
            <span>De: {{ card.from }}</span>
          </div>
          <div class="flex items-center gap-1">
            <MapPin class="w-4 h-4 text-gray-400" />
            <span>Para: {{ card.to }}</span>
          </div>
        </div>

        <!-- Coluna direita: tipo e preço -->
        <div class="flex flex-col items-end text-right">
          <p class="text-sm font-medium text-gray-700">{{ card.type }}</p>
          <p class="text-2xl font-bold text-gray-900">R$ {{ card.price.toFixed(2) }}</p>
          <p class="text-xs text-gray-500">por pessoa</p>
        </div>

        <Button 
          class="bg-green-700 hover:bg-green-800 text-white font-semibold px-6"
          v-if="!isExpanded[card.id]"
        >
          ESCOLHER IDA
        </Button>

        <Button 
          class="bg-white text-blue-800 border border-blue-800 hover:bg-blue-800 hover:text-white font-semibold px-6"
          v-if="isExpanded[card.id]"
          @click.stop="isExpanded[card.id] = false"
        >
          FECHAR
        </Button>

        <!-- Ícone de expansão -->
        <div class="sm:ml-2">
          <ChevronDown v-if="!isExpanded[card.id]" class="w-5 h-5 text-gray-400" />
          <ChevronUp v-else class="w-5 h-5 text-gray-400" />
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
                <div
                  v-for="(row, rowIndex) in card.busData.seats"
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>
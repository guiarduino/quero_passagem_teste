<script setup lang='ts'>
import { ref } from 'vue'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { MapPin, ChevronDown, ChevronUp } from 'lucide-vue-next'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './ui/resizable'

const isExpanded = ref(false)

const seatsInferior = [
  ["02", "X", "10", "14", "16", "18", "22", "26", "30", "34", "38", "42"],
  ["01", "X", "09", "X", "X", "17", "21", "25", "29", "33", "37", "X"]
]

const seatsSuperior = [
  ["X", "07", "X", "19", "X", "X", "31", "35", "39", "43"],
  ["04", "X", "X", "20", "24", "28", "32", "36", "40", "44"]
]

const toggleExpand = () => {
  if(isExpanded.value === false) {
    isExpanded.value = true
  }
}
</script>

<template>
  <h1 class="text-2xl font-bold mb-4">Resultados da Busca</h1>
  <p class="text-gray-600">10 passagens encontradas</p>
  
  <Card 
    class="mt-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
    @click="toggleExpand"
  >
    <CardContent class="flex flex-col sm:flex-row justify-between items-center gap-4 p-4">
      <!-- Coluna esquerda: logo e horários -->
      <div class="flex items-center gap-4 w-full sm:w-auto">
        <img src="https://via.placeholder.com/100x40?text=Princesa" alt="Princesa" class="h-10 object-contain" />
        <div class="flex flex-col">
          <div class="flex items-center gap-2 text-lg font-semibold">
            <span>08:00</span>
            <span class="text-gray-400">→</span>
            <span>16:05</span>
          </div>
          <p class="text-sm text-gray-500">Duração: 8h 5m</p>
        </div>
      </div>

      <!-- Coluna central: origem e destino -->
      <div class="hidden sm:flex flex-col items-start text-sm text-gray-700">
        <div class="flex items-center gap-1">
          <MapPin class="w-4 h-4 text-gray-400" />
          <span>De: Curitiba, PR - Rodoviária</span>
        </div>
        <div class="flex items-center gap-1">
          <MapPin class="w-4 h-4 text-gray-400" />
          <span>Para: Ourinhos, SP</span>
        </div>
      </div>

      <!-- Coluna direita: tipo e preço -->
      <div class="flex flex-col items-end text-right">
        <p class="text-sm font-medium text-gray-700">LEITO CAMA</p>
        <p class="text-2xl font-bold text-gray-900">R$ 298,99</p>
        <p class="text-xs text-gray-500">por pessoa</p>
      </div>

      <Button 
        class="bg-green-700 hover:bg-green-800 text-white font-semibold px-6"
        v-if="!isExpanded"
      >
        ESCOLHER IDA
      </Button>

      <Button 
        class="bg-white text-blue-800 border border-blue-800 hover:bg-blue-800 hover:text-white font-semibold px-6"
        v-if="isExpanded"
      >
        FECHAR
      </Button>

      <!-- Ícone de expansão -->
      <div class="sm:ml-2">
        <ChevronDown v-if="!isExpanded" class="w-5 h-5 text-gray-400" />
        <ChevronUp v-else class="w-5 h-5 text-gray-400" />
      </div>
    </CardContent>

    <!-- Conteúdo expandido -->
    <div 
      v-if="isExpanded"
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
            <div class="lg:col-span-2 border border-gray-200 rounded-2xl p-8 bg-gray-50">
                <!-- Painel 1 -->
                <ResizablePanelGroup
                    id="demo-group-1"
                    direction="horizontal"
                    class="rounded-lg border w-full"
                >
                    <ResizablePanel id="demo-panel-1" :default-size="20" class="h-[300px]">
                        <ResizablePanelGroup id="demo-group-2" direction="vertical">
                            <ResizablePanel id="demo-panel-2" :default-size="50">
                            <div class="flex h-full items-center justify-center p-6">
                                <span class="font-semibold">Two</span>
                            </div>
                            </ResizablePanel>
                            <ResizableHandle id="demo-handle-2" />
                            <ResizablePanel id="demo-panel-3" :default-size="50">
                            <div class="flex h-full items-center justify-center p-6">
                                <span class="font-semibold">Three</span>
                            </div>
                            </ResizablePanel>
                        </ResizablePanelGroup>
                    </ResizablePanel>
                    <ResizableHandle id="demo-handle-1" />
                    <ResizablePanel id="demo-panel-4" :default-size="80">
                        <ResizablePanelGroup id="demo-group-3" direction="vertical">
                            <ResizablePanel id="demo-panel-5" :default-size="50">
                            <div class="flex h-full items-center justify-center p-6">
                                <span class="font-semibold">Two</span>
                            </div>
                            </ResizablePanel>
                            <ResizableHandle id="demo-handle-2" />
                            <ResizablePanel id="demo-panel-6" :default-size="50">
                            <div class="flex h-full items-center justify-center p-6">
                                <span class="font-semibold">Three</span>
                            </div>
                            </ResizablePanel>
                        </ResizablePanelGroup>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Seletor de Assentos -->
        <div class="lg:col-span-2 border border-gray-200 rounded-2xl p-8 bg-gray-50">
          <!-- Bancos Superiores -->
          <div class="mb-12">
            <div
              v-for="(row, i) in seatsSuperior"
              :key="i"
              class="flex justify-center gap-2 mb-3"
            >
              <button
                v-for="(seat, j) in row"
                :key="j"
                :class="seat === 'X'
                  ? 'w-12 h-12 rounded-lg bg-gray-200 text-gray-500 text-sm font-semibold cursor-not-allowed'
                  : 'w-12 h-12 rounded-lg bg-white border border-gray-200 hover:border-blue-500 text-sm font-semibold transition-colors'"
              >
                {{ seat }}
              </button>
            </div>
          </div>

          <!-- Bancos Inferiores -->
          <div class="flex items-start">
            <div class="flex flex-col justify-start mr-2">
              <svg class="w-14 h-14 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="7"/>
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 5v3m0 8v3M5 12h3m8 0h3"/>
              </svg>
            </div>
            <div class="flex-1">
              <div
                v-for="(row, i) in seatsInferior"
                :key="i"
                class="flex justify-center gap-2 mb-3"
              >
                <button
                  v-for="(seat, j) in row"
                  :key="j"
                  :class="seat === 'X'
                    ? 'w-12 h-12 rounded-lg bg-gray-200 text-gray-500 text-sm font-semibold cursor-not-allowed'
                    : 'w-12 h-12 rounded-lg bg-white border border-gray-200 hover:border-blue-500 text-sm font-semibold transition-colors'"
                >
                  {{ seat }}
                </button>
              </div>
            </div>
          </div>

          <!-- Legenda -->
          <div class="flex items-center justify-center gap-8 mt-8 text-sm">
            <div class="flex items-center gap-2">
              <div class="w-10 h-10 rounded-lg bg-white border border-gray-200"></div>
              <span class="text-gray-700 font-medium">Livre</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-10 h-10 rounded-lg bg-blue-600"></div>
              <span class="text-gray-700 font-medium">Selecionado</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-semibold">X</div>
              <span class="text-gray-700 font-medium">Ocupado</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <CardFooter class="flex items-center justify-between px-4 py-2 border-t bg-gray-50">
      <div class="flex items-center gap-1 text-yellow-500 text-sm font-semibold">
        <span>★</span>
        <span class="text-gray-700">4.8</span>
      </div>
      <div class="text-green-700 text-xs font-medium">
        Embarque direto
      </div>
    </CardFooter>
  </Card>
</template>
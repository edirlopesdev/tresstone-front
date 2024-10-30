import { useState, useEffect } from 'react';
import { ResultadoClareamento } from '../types/supabase-types';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { average, standardDeviation } from 'simple-statistics';

interface ColorReferenceProps {
  corBase: string;
  corDesejada: string;
  onColorSelect: (base: string, target: string) => void;
  onCalculate: (resultado: ResultadoClareamento) => void;
}

const NIVEIS_CORES = [
  { 
    valor: '1', 
    descricao: 'Preto', 
    rgb: { R: 14, G: 14, B: 14 }
  },
  { 
    valor: '3', 
    descricao: 'Castanho Escuro', 
    rgb: { R: 55, G: 20, B: 14 }
  },
  { 
    valor: '4', 
    descricao: 'Castanho Médio', 
    rgb: { R: 64, G: 22, B: 15 }
  },
  { 
    valor: '5', 
    descricao: 'Castanho Claro', 
    rgb: { R: 74, G: 29, B: 17 }
  },
  { 
    valor: '6', 
    descricao: 'Loiro Escuro', 
    rgb: { R: 73, G: 45, B: 21 }
  },
  { 
    valor: '7', 
    descricao: 'Loiro Médio', 
    rgb: { R: 78, G: 55, B: 25 }
  },
  { 
    valor: '8', 
    descricao: 'Loiro Claro', 
    rgb: { R: 140, G: 115, B: 64 }
  },
  { 
    valor: '9', 
    descricao: 'Loiro Muito Claro', 
    rgb: { R: 193, G: 167, B: 103 }
  },
  { 
    valor: '10', 
    descricao: 'Loiro Claríssimo', 
    rgb: { R: 223, G: 211, B: 142 }
  },
];

type RGBChannel = 'R' | 'G' | 'B';
type RGBColor = { R: number; G: number; B: number };
type ColorStats = { 
  R: { avg: number; std: number }; 
  G: { avg: number; std: number }; 
  B: { avg: number; std: number }; 
};

// Função para analisar a cor da imagem
async function analisarCorImagem(imageUrl: string): Promise<RGBColor> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Não foi possível criar contexto 2d'));
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        
        try {
          ctx.drawImage(img, 0, 0);
          
          // Coletar amostras do centro da imagem
          const centerX = Math.floor(img.width / 2);
          const centerY = Math.floor(img.height / 2);
          const sampleSize = Math.min(100, Math.floor(Math.min(img.width, img.height) / 4));
          
          let totalR = 0, totalG = 0, totalB = 0;
          let sampleCount = 0;

          for (let x = -sampleSize; x < sampleSize; x += 2) {
            for (let y = -sampleSize; y < sampleSize; y += 2) {
              const data = ctx.getImageData(
                centerX + x, 
                centerY + y, 
                1, 
                1
              ).data;

              // Verificar se os valores são válidos
              if (data && data.length >= 3) {
                totalR += data[0];
                totalG += data[1];
                totalB += data[2];
                sampleCount++;
              }
            }
          }

          if (sampleCount === 0) {
            throw new Error('Não foi possível coletar amostras de cor válidas');
          }

          const finalColor = {
            R: Math.round(totalR / sampleCount),
            G: Math.round(totalG / sampleCount),
            B: Math.round(totalB / sampleCount)
          };

          console.log("Amostras coletadas:", sampleCount);
          console.log("Cor final:", finalColor);
          
          resolve(finalColor);
        } catch (e) {
          console.error('Erro ao processar imagem:', e);
          reject(new Error('Erro ao processar imagem'));
        }
      } catch (error) {
        console.error('Erro ao analisar imagem:', error);
        reject(error);
      }
    };

    img.onerror = (e) => {
      console.error('Erro ao carregar imagem:', e);
      reject(new Error('Erro ao carregar imagem'));
    };

    try {
      img.src = imageUrl;
    } catch (e) {
      console.error('Erro ao definir URL da imagem:', e);
      reject(new Error('URL da imagem inválida'));
    }
  });
}

// Função auxiliar para converter RGB para HSL
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    
    h /= 6;
  }

  return [h, s, l];
}

// Função para calcular a distância entre duas cores RGB
function calcularDistanciaCores(cor1: { R: number, G: number, B: number }, cor2: { R: number, G: number, B: number }): number {
  // Garantir que todos os valores são números válidos
  const r1 = Math.max(0, Math.min(255, Math.round(cor1.R)));
  const g1 = Math.max(0, Math.min(255, Math.round(cor1.G)));
  const b1 = Math.max(0, Math.min(255, Math.round(cor1.B)));
  const r2 = Math.max(0, Math.min(255, Math.round(cor2.R)));
  const g2 = Math.max(0, Math.min(255, Math.round(cor2.G)));
  const b2 = Math.max(0, Math.min(255, Math.round(cor2.B)));

  return Math.sqrt(
    Math.pow(r1 - r2, 2) +
    Math.pow(g1 - g2, 2) +
    Math.pow(b1 - b2, 2)
  );
}

// Função para encontrar a cor mais próxima
function encontrarCorMaisProxima(cor: { R: number, G: number, B: number }): string {
  // Validar se todos os valores RGB são números válidos
  if (isNaN(cor.R) || isNaN(cor.G) || isNaN(cor.B)) {
    console.warn('Valores RGB inválidos:', cor);
    return '1'; // Valor padrão caso a detecção falhe
  }

  let menorDistancia = Infinity;
  let corMaisProxima = NIVEIS_CORES[0];

  NIVEIS_CORES.forEach(nivel => {
    const distancia = calcularDistanciaCores(cor, nivel.rgb);
    if (!isNaN(distancia) && distancia < menorDistancia) {
      menorDistancia = distancia;
      corMaisProxima = nivel;
    }
  });

  console.log("Cor detectada:", cor);
  console.log("Cor mais próxima:", corMaisProxima);
  return corMaisProxima.valor;
}

export function ColorReferenceSystem({ 
  corBase, 
  corDesejada, 
  onColorSelect,
  onCalculate,
  fotoAntesUrl
}: ColorReferenceProps & { fotoAntesUrl?: string }) {
  const [selectedBase, setSelectedBase] = useState(corBase || '');
  const [selectedTarget, setSelectedTarget] = useState(corDesejada || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setSelectedBase(corBase || '');
    setSelectedTarget(corDesejada || '');
  }, [corBase, corDesejada]);

  useEffect(() => {
    if (fotoAntesUrl) {
      console.log("Iniciando análise da foto:", fotoAntesUrl);
      setIsAnalyzing(true);
      setErrorMessage(null);

      analisarCorImagem(fotoAntesUrl)
        .then(corDetectada => {
          console.log("Cor detectada (RGB):", corDetectada);
          const nivelDetectado = encontrarCorMaisProxima(corDetectada);
          console.log("Nível detectado:", nivelDetectado);
          console.log("Cor correspondente:", NIVEIS_CORES.find(n => n.valor === nivelDetectado));
          
          if (nivelDetectado) {
            handleBaseChange(nivelDetectado);
          } else {
            setErrorMessage("Não foi possível detectar a cor base");
          }
        })
        .catch(error => {
          console.error('Erro ao analisar cor:', error);
          setErrorMessage("Erro ao analisar a imagem");
        })
        .finally(() => {
          setIsAnalyzing(false);
        });
    }
  }, [fotoAntesUrl]);

  const handleBaseChange = (value: string) => {
    setSelectedBase(value);
    onColorSelect(value, selectedTarget);
  };

  const handleTargetChange = (value: string) => {
    setSelectedTarget(value);
    onColorSelect(selectedBase, value);
  };

  const calcularClareamento = () => {
    if (!selectedBase || !selectedTarget) return;

    const nivelBase = parseInt(selectedBase);
    const nivelAlvo = parseInt(selectedTarget);
    const niveisNecessarios = Math.max(0, nivelAlvo - nivelBase);

    const resultado: ResultadoClareamento = {
      niveis_necessarios: niveisNecessarios,
      volume_oxidante: calcularVolumeOxidante(niveisNecessarios),
      tempo_estimado: calcularTempoEstimado(niveisNecessarios),
      fundo_revelacao: determinarFundoRevelacao(nivelBase),
      produtos_recomendados: determinarProdutosRecomendados(niveisNecessarios),
    };

    onCalculate(resultado);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Cor Base (Detectada)</Label>
        {isAnalyzing && (
          <div className="text-sm text-muted-foreground">
            Analisando imagem...
          </div>
        )}
        {errorMessage && (
          <div className="text-sm text-red-500">
            {errorMessage}
          </div>
        )}
        <Select 
          value={selectedBase} 
          onValueChange={handleBaseChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione a cor base" />
          </SelectTrigger>
          <SelectContent>
            {NIVEIS_CORES.map((nivel) => (
              <SelectItem 
                key={nivel.valor} 
                value={nivel.valor}
                className="flex items-center gap-2"
              >
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{
                    backgroundColor: `rgb(${nivel.rgb.R},${nivel.rgb.G},${nivel.rgb.B})`
                  }}
                />
                {nivel.descricao}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Cor Desejada</Label>
        <Select 
          value={selectedTarget} 
          onValueChange={handleTargetChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione a cor desejada" />
          </SelectTrigger>
          <SelectContent>
            {NIVEIS_CORES.map((nivel) => (
              <SelectItem key={nivel.valor} value={nivel.valor}>
                {nivel.descricao}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button onClick={calcularClareamento}>
        Calcular
      </Button>
    </div>
  );
}

// Funções auxiliares (implementar conforme necessário)
function calcularVolumeOxidante(niveis: number): number {
  // Implementar lógica
  return 20; // Volume padrão
}

function calcularTempoEstimado(niveis: number): number {
  // Implementar lógica
  return niveis * 15; // 15 minutos por nível
}

function determinarFundoRevelacao(nivelBase: number): string {
  // Implementar lógica
  return "Amarelo"; // Exemplo
}

function determinarProdutosRecomendados(niveis: number): string[] {
  // Implementar lógica
  return ["Pó descolorante", "Oxidante 20 volumes"]; // Exemplo
} 
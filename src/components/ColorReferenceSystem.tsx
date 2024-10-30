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
    valor: '6.1',
    descricao: 'Loiro Escuro Acinzentado',
    rgb: { R: 71, G: 43, B: 28 }
  },
  {
    valor: '6.12',
    descricao: 'Loiro Escuro Acinzentado Irisado',
    rgb: { R: 69, G: 41, B: 32 }
  },
  { 
    valor: '7', 
    descricao: 'Loiro Médio', 
    rgb: { R: 78, G: 55, B: 25 }
  },
  {
    valor: '7.1',
    descricao: 'Loiro Médio Acinzentado',
    rgb: { R: 76, G: 53, B: 32 }
  },
  {
    valor: '7.12',
    descricao: 'Loiro Médio Acinzentado Irisado',
    rgb: { R: 74, G: 51, B: 38 }
  },
  { 
    valor: '8', 
    descricao: 'Loiro Claro', 
    rgb: { R: 140, G: 115, B: 64 }
  },
  {
    valor: '8.1',
    descricao: 'Loiro Claro Acinzentado',
    rgb: { R: 138, G: 113, B: 71 }
  },
  {
    valor: '8.12',
    descricao: 'Loiro Claro Acinzentado Irisado',
    rgb: { R: 136, G: 111, B: 77 }
  },
  { 
    valor: '9', 
    descricao: 'Loiro Muito Claro', 
    rgb: { R: 193, G: 167, B: 103 }
  },
  {
    valor: '9.1',
    descricao: 'Loiro Muito Claro Acinzentado',
    rgb: { R: 191, G: 165, B: 110 }
  },
  {
    valor: '9.12',
    descricao: 'Loiro Muito Claro Acinzentado Irisado',
    rgb: { R: 189, G: 163, B: 116 }
  },
  { 
    valor: '10', 
    descricao: 'Loiro Claríssimo', 
    rgb: { R: 223, G: 211, B: 142 }
  },
  {
    valor: '10.1',
    descricao: 'Loiro Claríssimo Acinzentado',
    rgb: { R: 221, G: 209, B: 149 }
  },
  {
    valor: '10.12',
    descricao: 'Loiro Claríssimo Acinzentado Irisado',
    rgb: { R: 219, G: 207, B: 155 }
  }
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

// Função para calcular a distância ponderada entre cores
function calcularDistanciaCores(cor1: RGBColor, cor2: RGBColor): number {
  // Converter ambas as cores para HSL para melhor comparação
  const [h1, s1, l1] = rgbToHsl(cor1.R, cor1.G, cor1.B);
  const [h2, s2, l2] = rgbToHsl(cor2.R, cor2.G, cor2.B);

  // Pesos para diferentes aspectos da cor
  const pesoMatiz = 2.0;      // Maior peso para o tom
  const pesoSaturacao = 1.0;  // Peso médio para saturação
  const pesoLuminosidade = 1.5; // Peso alto para luminosidade

  // Calcular diferenças
  let dMatiz = Math.min(Math.abs(h1 - h2), 1 - Math.abs(h1 - h2)) * 360;
  const dSaturacao = Math.abs(s1 - s2) * 100;
  const dLuminosidade = Math.abs(l1 - l2) * 100;

  // Retornar distância ponderada
  return Math.sqrt(
    Math.pow(dMatiz * pesoMatiz, 2) +
    Math.pow(dSaturacao * pesoSaturacao, 2) +
    Math.pow(dLuminosidade * pesoLuminosidade, 2)
  );
}

// Adicionar nova interface para o tipo de candidato
interface Candidato {
  nivel: {
    valor: string;
    descricao: string;
    rgb: RGBColor;
  };
  distancia: number;
}

// Função para encontrar a cor mais próxima
function encontrarCorMaisProxima(cor: RGBColor): string {
  if (isNaN(cor.R) || isNaN(cor.G) || isNaN(cor.B)) {
    console.warn('Valores RGB inválidos:', cor);
    return '1';
  }

  // Converter a cor detectada para HSL
  const [hDetectado, sDetectado, lDetectado] = rgbToHsl(cor.R, cor.G, cor.B);
  
  let menorDistancia = Infinity;
  let corMaisProxima = NIVEIS_CORES[0];
  let candidatos: Candidato[] = []; // Tipagem explícita do array

  // Primeira passagem: encontrar as cores mais próximas
  NIVEIS_CORES.forEach(nivel => {
    const distancia = calcularDistanciaCores(cor, nivel.rgb);
    
    if (!isNaN(distancia)) {
      if (distancia < menorDistancia) {
        menorDistancia = distancia;
        corMaisProxima = nivel;
      }
      
      // Coletar candidatos próximos (até 20% mais distantes que o melhor)
      if (distancia <= menorDistancia * 1.2) {
        candidatos.push({ nivel, distancia });
      }
    }
  });

  // Se houver candidatos próximos, refinar a seleção
  if (candidatos.length > 1) {
    // Ordenar candidatos por distância
    candidatos.sort((a, b) => a.distancia - b.distancia);
    
    // Analisar os 3 primeiros candidatos mais próximos
    const melhoresCandidatos = candidatos.slice(0, 3);
    console.log("Candidatos mais próximos:", melhoresCandidatos);
    
    // Usar o primeiro candidato (mais próximo)
    corMaisProxima = melhoresCandidatos[0].nivel;
  }

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
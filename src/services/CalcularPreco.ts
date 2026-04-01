// Tarifas por tipo de viagem
const TARIFAS = {
  Convencional: { base: 5.0,  porKm: 2.0,  porMin: 0.30 },
  EconoComigo:  { base: 3.0,  porKm: 1.50, porMin: 0.20 },
  Premium:      { base: 10.0, porKm: 3.50, porMin: 0.80 },
} as const;

type TipoViagem = keyof typeof TARIFAS;

// Haversine — distância em linha reta entre dois pontos lat/lng
function calcularDistanciaKm(
  latOrigem: number, lngOrigem: number,
  latDestino: number, lngDestino: number
): number {
  const R = 6371; // raio da Terra em km
  const dLat = ((latDestino - latOrigem) * Math.PI) / 180;
  const dLng = ((lngDestino - lngOrigem) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((latOrigem * Math.PI) / 180) *
    Math.cos((latDestino * Math.PI) / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Estima duração em minutos: velocidade média urbana de 30km/h
function estimarDuracaoMin(distanciaKm: number): number {
  const velocidadeMediaKmh = 30;
  return Math.ceil((distanciaKm / velocidadeMediaKmh) * 60);
}

export function calcularPreco(
  latOrigem: number, lngOrigem: number,
  latDestino: number, lngDestino: number,
  tipoViagem: TipoViagem
): { preco: number; distanciaKm: number; duracaoEstimadaMin: number } {
  const tarifa = TARIFAS[tipoViagem];
  const distanciaKm = calcularDistanciaKm(latOrigem, lngOrigem, latDestino, lngDestino);
  const duracaoEstimadaMin = estimarDuracaoMin(distanciaKm);

  const preco = parseFloat(
    (tarifa.base + distanciaKm * tarifa.porKm + duracaoEstimadaMin * tarifa.porMin).toFixed(2)
  );

  return { preco, distanciaKm: parseFloat(distanciaKm.toFixed(2)), duracaoEstimadaMin };
}
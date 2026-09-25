export interface AvaliacaoDTO {
  idAvaliacao?: number | undefined;
  idCorrida: number;
  nota: number;
  comentario?: string | null | undefined;
}
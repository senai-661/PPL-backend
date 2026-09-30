export interface EnderecoDTO {
  id_endereco?: number | null | undefined;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  complemento?: string | null | undefined;
  id_motorista?: number | null | undefined;
  id_passageiro?: number | null | undefined;
}
export interface EnderecoDTO {
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
    complemento: string | null;
    // O "?" torna opcional e o "| null" permite o valor nulo
    id_motorista?: number | null; 
    id_passageiro?: number | null;
}
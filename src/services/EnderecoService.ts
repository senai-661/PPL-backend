import axios from "axios";
import type { EnderecoDTO } from "../interface/EnderecoDTO.js";
import { Endereco } from "../models/Endereco.js";
import { EnderecoRepository } from "../repositories/EnderecoRepository.js";

interface NominatimAddress {
  road?: string;
  pedestrian?: string;
  footway?: string;
  cycleway?: string;
  path?: string;
  house_number?: string;
  suburb?: string;
  neighbourhood?: string;
  city_district?: string;
  borough?: string;
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  county?: string;
  state?: string;
}

interface NominatimResponseItem {
  display_name: string;
  lat: string;
  lon: string;
  address?: NominatimAddress;
  type?: string;
  class?: string;
  name?: string;
}

export interface EnderecoSugestao {
  display_name: string;
  titulo: string;
  subtitulo: string;
  categoria: string;
  lat: number;
  lon: number;
  address?: NominatimAddress;
}

export class EnderecoService {
  private static readonly NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

  private static construirTitulo(item: NominatimResponseItem): string {
    const address = item.address;
    const via =
      address?.road ??
      address?.pedestrian ??
      address?.footway ??
      address?.cycleway ??
      address?.path ??
      item.name;

    const numero = address?.house_number;
    const titulo = [via, numero].filter(Boolean).join(", ");

    if (titulo) {
      return titulo;
    }

    return item.display_name.split(",")[0]?.trim() || item.display_name;
  }

  private static construirSubtitulo(address?: NominatimAddress): string {
    if (!address) {
      return "";
    }

    const partes = [
      address.suburb ?? address.neighbourhood ?? address.city_district ?? address.borough,
      address.city ?? address.town ?? address.village ?? address.municipality ?? address.county,
      address.state,
    ].filter(Boolean) as string[];

    return Array.from(new Set(partes)).join(" - ");
  }

  static async buscarSugestoes(query: string, limit: number = 5): Promise<EnderecoSugestao[]> {
    try {
      const termo = query.trim();

      if (termo.length < 2) {
        return [];
      }

      const response = await axios.get<NominatimResponseItem[]>(EnderecoService.NOMINATIM_URL, {
        params: {
          q: termo,
          format: "jsonv2",
          addressdetails: 1,
          countrycodes: "br",
          dedupe: 1,
          limit,
        },
        headers: {
          "Accept-Language": "pt-BR",
          "User-Agent": "OpenLine-API/1.0",
        },
        timeout: 8000,
      });

      return response.data.map((item) => ({
        display_name: item.display_name,
        titulo: EnderecoService.construirTitulo(item),
        subtitulo: EnderecoService.construirSubtitulo(item.address),
        categoria: item.type ?? item.class ?? "endereco",
        lat: Number.parseFloat(item.lat),
        lon: Number.parseFloat(item.lon),
        ...(item.address ? { address: item.address } : {}),
      }));
    } catch (error) {
      console.error("Erro na busca de sugestoes de endereco:", error);
      return [];
    }
  }

  static async buscarCoordenadas(endereco: string): Promise<{ lat: number; lon: number } | null> {
    try {
      const sugestoes = await EnderecoService.buscarSugestoes(endereco, 1);

      if (sugestoes.length === 0) {
        return null;
      }

      return {
        lat: sugestoes[0]!.lat,
        lon: sugestoes[0]!.lon,
      };
    } catch (error) {
      console.error("Erro ao buscar coordenadas:", error);
      return null;
    }
  }

  static async listarTodos(): Promise<any[] | null> {
    return await EnderecoRepository.listarTodos();
  }

  static async buscarPorId(idEndereco: number): Promise<any | null> {
    return await EnderecoRepository.buscarPorId(idEndereco);
  }

  static async criar(dados: {
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
    complemento?: string | null;
    idMotorista?: number | null;
    idPassageiro?: number | null;
  }): Promise<{ sucesso: boolean; erro?: string }> {
    const { rua, numero, bairro, cidade, estado, cep, complemento, idMotorista, idPassageiro } = dados;

    if (!rua || !numero || !bairro || !cidade || !estado || !cep) {
      return { sucesso: false, erro: "Campos obrigatórios de endereço faltando." };
    }

    const enderecoDTO: EnderecoDTO = {
      rua,
      numero,
      bairro,
      cidade,
      estado,
      cep,
      complemento: complemento || null,
      id_motorista: idMotorista || null,
      id_passageiro: idPassageiro || null,
    };

    const novoEndereco = new Endereco(enderecoDTO);
    const sucesso = await EnderecoRepository.cadastro(novoEndereco);

    if (!sucesso) {
      return { sucesso: false, erro: "Erro ao cadastrar endereço." };
    }

    return { sucesso: true };
  }

  static async cadastrarParaUsuario(
    idUsuario: number,
    tipo: "motorista" | "passageiro",
    dados: any
  ): Promise<boolean> {
    try {
      const enderecoDTO: EnderecoDTO = {
        rua: dados.rua,
        numero: dados.numero,
        bairro: dados.bairro,
        cidade: dados.cidade,
        estado: dados.estado,
        cep: dados.cep,
        complemento: dados.complemento,
        id_motorista: tipo === "motorista" ? idUsuario : null,
        id_passageiro: tipo === "passageiro" ? idUsuario : null,
      };

      const novoEndereco = new Endereco(enderecoDTO);
      return await EnderecoRepository.cadastro(novoEndereco);
    } catch (error) {
      console.error("Falha no cadastro de endereço:", error);
      return false;
    }
  }

  static async atualizar(
    idEndereco: number,
    dados: Partial<EnderecoDTO>
  ): Promise<boolean> {
    return await EnderecoRepository.atualizar(idEndereco, dados);
  }

  static async remover(idEndereco: number): Promise<boolean> {
    return await EnderecoRepository.deletar(idEndereco);
  }
}

import axios from "axios";
import { EnderecoRepository } from "../repository/EnderecoRepository.js";
import type { EnderecoDTO } from "../interface/EnderecoDTO.js";

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

interface PhotonFeature {
  properties: {
    name?: string;
    street?: string;
    housenumber?: string;
    district?: string;
    locality?: string;
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
    countrycode?: string;
    osm_key?: string;
    osm_value?: string;
    type?: string;
  };
  geometry: {
    coordinates: [number, number];
  };
}

interface PhotonResponse {
  features: PhotonFeature[];
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
  private static readonly PHOTON_URL = "https://photon.komoot.io/api/";

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

  private static async buscarNoPhoton(query: string, limit: number): Promise<EnderecoSugestao[]> {
    const response = await axios.get<PhotonResponse>(EnderecoService.PHOTON_URL, {
      params: { q: query, limit, countrycode: "BR" },
      headers: { Accept: "application/json" },
      timeout: 8000,
    });

    return response.data.features
      .filter((feature) => feature.properties.countrycode?.toUpperCase() === "BR")
      .map((feature) => {
        const properties = feature.properties;
        const address: NominatimAddress = {
          ...(properties.street ? { road: properties.street } : {}),
          ...(properties.housenumber ? { house_number: properties.housenumber } : {}),
          ...(properties.district ? { suburb: properties.district } : {}),
          ...(properties.city ? { city: properties.city } : {}),
          ...(properties.town ? { town: properties.town } : {}),
          ...(properties.village ? { village: properties.village } : {}),
          ...(properties.state ? { state: properties.state } : {}),
        };
        const titulo = [properties.name ?? properties.street, properties.housenumber]
          .filter(Boolean)
          .join(", ");
        const displayName = [
          titulo || properties.name,
          properties.district,
          properties.locality ?? properties.city ?? properties.town ?? properties.village,
          properties.state,
          properties.country,
        ].filter(Boolean).join(", ");

        return {
          display_name: displayName,
          titulo: titulo || properties.name || displayName,
          subtitulo: EnderecoService.construirSubtitulo(address),
          categoria: properties.type ?? properties.osm_value ?? properties.osm_key ?? "endereco",
          lat: feature.geometry.coordinates[1],
          lon: feature.geometry.coordinates[0],
          address,
        };
      });
  }

  static async buscarSugestoes(query: string, limit: number = 5): Promise<EnderecoSugestao[]> {
    const termo = query.trim();
    if (termo.length < 2) {
      return [];
    }

    try {
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

      const sugestoes = response.data.map((item) => ({
        display_name: item.display_name,
        titulo: EnderecoService.construirTitulo(item),
        subtitulo: EnderecoService.construirSubtitulo(item.address),
        categoria: item.type ?? item.class ?? "endereco",
        lat: Number.parseFloat(item.lat),
        lon: Number.parseFloat(item.lon),
        ...(item.address ? { address: item.address } : {}),
      }));

      if (sugestoes.length > 0) {
        return sugestoes;
      }

      console.warn("Nominatim não encontrou endereços; usando Photon como alternativa.");
    } catch (error) {
      console.warn("Nominatim indisponível; tentando Photon:", error);
    }

    try {
      return await EnderecoService.buscarNoPhoton(termo, limit);
    } catch (error) {
      console.error("Erro ao buscar sugestões no Nominatim e no Photon:", error);
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
    if (isNaN(idEndereco)) {
      throw new Error("ID do endereço inválido.");
    }
    return await EnderecoRepository.buscarPorId(idEndereco);
  }

  static async criar(dados: EnderecoDTO): Promise<boolean> {
    if (!dados.rua || !dados.numero || !dados.bairro || !dados.cidade || !dados.estado || !dados.cep) {
      throw new Error("Campos obrigatórios de endereço faltando.");
    }
    return await EnderecoRepository.cadastro(dados);
  }

  static async cadastrarParaUsuario(
    idUsuario: number,
    tipo: "motorista" | "passageiro",
    dados: any,
  ): Promise<boolean> {
    const enderecoDTO: EnderecoDTO = {
      rua: dados.rua,
      numero: dados.numero,
      bairro: dados.bairro,
      cidade: dados.cidade,
      estado: dados.estado,
      cep: dados.cep,
      complemento: dados.complemento ?? null,
      id_motorista: tipo === "motorista" ? idUsuario : null,
      id_passageiro: tipo === "passageiro" ? idUsuario : null,
    };
    return await EnderecoRepository.cadastro(enderecoDTO);
  }

  static async atualizar(idEndereco: number, dados: Partial<EnderecoDTO>): Promise<boolean> {
    if (isNaN(idEndereco)) {
      throw new Error("ID do endereço inválido.");
    }
    return await EnderecoRepository.atualizar(idEndereco, dados);
  }

  static async remover(idEndereco: number): Promise<boolean> {
    if (isNaN(idEndereco)) {
      throw new Error("ID do endereço inválido.");
    }
    return await EnderecoRepository.deletar(idEndereco);
  }
}

import { AdminRepository } from "../repository/AdminRepository.js";
import { PassageiroService } from "./PassageiroService.js";
import { MotoristaService } from "./MotoristaService.js";

export class AdminService {
  static async listar(): Promise<any[]> {
    const admins = await AdminRepository.listarAdmins();
    if (!admins || admins.length === 0) {
      return [];
    }

    return admins.map((a) => ({
      id: a.getIdAdmin(),
      nome: a.getNome(),
      sobrenome: a.getSobrenome(),
      email: a.getEmail(),
    }));
  }

  static async dashboard(): Promise<any | null> {
    return await AdminRepository.dashboard();
  }

  static async atualizarPassageiro(idPassageiro: number, dados: any): Promise<boolean> {
    if (isNaN(idPassageiro)) {
      throw new Error("ID do passageiro inválido.");
    }
    const passageiro = await PassageiroService.buscarPorId(idPassageiro);
    if (!passageiro) {
      const err: any = new Error("Passageiro não encontrado.");
      err.status = 404;
      throw err;
    }
    return await PassageiroService.editarPerfil(idPassageiro, dados);
  }

  static async removerPassageiro(idPassageiro: number): Promise<boolean> {
    if (isNaN(idPassageiro)) {
      throw new Error("ID do passageiro inválido.");
    }
    return await PassageiroService.remover(idPassageiro);
  }

  static async atualizarMotorista(idMotorista: number, dados: any): Promise<boolean> {
    if (isNaN(idMotorista)) {
      throw new Error("ID do motorista inválido.");
    }
    const motorista = await MotoristaService.buscarPorId(idMotorista);
    if (!motorista) {
      const err: any = new Error("Motorista não encontrado.");
      err.status = 404;
      throw err;
    }
    return await MotoristaService.editarPerfil(idMotorista, dados);
  }

  static async removerMotorista(idMotorista: number): Promise<boolean> {
    if (isNaN(idMotorista)) {
      throw new Error("ID do motorista inválido.");
    }
    return await MotoristaService.remover(idMotorista);
  }
}

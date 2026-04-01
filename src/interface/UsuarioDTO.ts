export interface UsuarioDTO {
    idUsuario?: number;
    nome: string;
    sobrenome: string;
    email: string;
    tipoUsuario: string;
    senha: string;
    criadoEm?: Date;
}
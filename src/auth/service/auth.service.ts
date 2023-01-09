import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { GrupoService } from "../../grupopi/service/grupo.service";
import { Bcrypt } from "../bcrypt/bcrypt";

@Injectable()
export class AuthService {
    constructor(
        private grupoService: GrupoService,
        private jwtService: JwtService,
        private bcrypt: Bcrypt
    ) { }

    async validarGrupo(numeroGrupo: string): Promise<any> {
        const buscarGrupo = await this.grupoService.findByGrupo(numeroGrupo)

        if (!buscarGrupo)
            throw new HttpException('Grupo não encontrado!', HttpStatus.NOT_FOUND)

        const match = await this.bcrypt.compararNumero(buscarGrupo.numeroGrupo, numeroGrupo)

        if (buscarGrupo && match) {
            const { numeroGrupo, ...result } = buscarGrupo
            return result;
        }
        return null;
    }

    async login(grupoLogin: any) {
        const payload = {username: grupoLogin.grupo, sub: "db_genworktable"}

        return{
            grupo: grupoLogin.grupo,
            token: `Bearer ${this.jwtService.sign(payload)}`
        }
    }

}
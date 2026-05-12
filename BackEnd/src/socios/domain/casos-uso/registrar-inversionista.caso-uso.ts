import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { RegistrarInversionistaDto } from '../../presentation/dto/registrar-inversionista.dto.js';
import { UsuarioFuenteDatos } from '../../../autenticacion/data/fuentes-datos/usuario.fuente-datos.js';
import { InversionistaFuenteDatos } from '../../data/fuentes-datos/inversionista.fuente-datos.js';
import { USUARIO_REPOSITORIO } from '../../../autenticacion/domain/interfaces/usuario.repositorio.js';
import type { UsuarioRepositorio } from '../../../autenticacion/domain/interfaces/usuario.repositorio.js';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RegistrarInversionistaUseCase {
  constructor(
    private readonly dataSource: DataSource,
    @Inject(USUARIO_REPOSITORIO)
    private readonly usuarioRepositorio: UsuarioRepositorio,
  ) {}

  async ejecutar(dto: RegistrarInversionistaDto): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Lógica de Variación de Email (en caso de que ya exista)
      let emailFinal = dto.email;
      let existe = await this.usuarioRepositorio.buscarPorEmail(emailFinal);
      let contador = 1;

      while (existe) {
        const [userPart, domainPart] = dto.email.split('@');
        emailFinal = `${userPart}${contador}@${domainPart}`;
        existe = await this.usuarioRepositorio.buscarPorEmail(emailFinal);
        contador++;
      }

      // 2. Crear Usuario con rol 'inversor'
      const hashedPass = await bcrypt.hash(dto.passwordGenerado, 10);
      const usuario = queryRunner.manager.create(UsuarioFuenteDatos, {
        id: uuidv4(),
        nombre: dto.nombreCompleto,
        email: emailFinal,
        password: hashedPass,
        rol: dto.rol || 'inversor',
      });
      const usuarioGuardado = await queryRunner.manager.save(
        UsuarioFuenteDatos,
        usuario,
      );

      // 3. Crear Perfil de Inversionista
      const inversionistaData: Partial<InversionistaFuenteDatos> = {
        id: uuidv4(),
        usuario_id: usuarioGuardado.id,
        ci_dni: dto.ciDni,
        telefono: dto.telefono,
        direccion: dto.direccion,
        profesion: dto.profesion,
        origen_fondos: dto.origenFondos,
      };
      const inversionista = queryRunner.manager.create(
        InversionistaFuenteDatos,
        inversionistaData,
      );
      await queryRunner.manager.save(InversionistaFuenteDatos, inversionista);

      await queryRunner.commitTransaction();

      return {
        success: true,
        mensaje: 'Inversionista registrado exitosamente',
        data: {
          email: emailFinal,
          password: dto.passwordGenerado,
          nombre: dto.nombreCompleto,
          id: inversionista.id,
        },
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.error('Error en RegistrarInversionistaUseCase:', err);
      throw new InternalServerErrorException(
        'Error al registrar el inversionista: ' + err.message,
      );
    } finally {
      await queryRunner.release();
    }
  }
}

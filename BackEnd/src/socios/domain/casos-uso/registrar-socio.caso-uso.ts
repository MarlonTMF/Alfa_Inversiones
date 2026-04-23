import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { RegistrarSocioDto } from '../../presentation/dto/registrar-socio.dto.js';
import { UsuarioFuenteDatos } from '../../../autenticacion/data/fuentes-datos/usuario.fuente-datos.js';
import { SocioFuenteDatos } from '../../data/fuentes-datos/socio.fuente-datos.js';
import { USUARIO_REPOSITORIO } from '../../../autenticacion/domain/interfaces/usuario.repositorio.js';
import type { UsuarioRepositorio } from '../../../autenticacion/domain/interfaces/usuario.repositorio.js';
import { ImageKitService } from '../../../common/services/imagekit.service.js';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RegistrarSocioUseCase {
  constructor(
    private readonly dataSource: DataSource,
    @Inject(USUARIO_REPOSITORIO)
    private readonly usuarioRepositorio: UsuarioRepositorio,
    private readonly imageKitService: ImageKitService,
  ) {}

  async ejecutar(
    dto: RegistrarSocioDto,
    files?: { testimonio?: Express.Multer.File[], padron?: Express.Multer.File[] }
  ): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Subir archivos a ImageKit si existen
      let urlTestimonio: string | null = null;
      let urlPadron: string | null = null;

      if (files?.testimonio?.[0]) {
        const res = await this.imageKitService.uploadFile(
          files.testimonio[0],
          `testimonio-${dto.nit}-${Date.now()}`
        );
        urlTestimonio = res.url;
      }

      if (files?.padron?.[0]) {
        const res = await this.imageKitService.uploadFile(
          files.padron[0],
          `padron-${dto.nit}-${Date.now()}`
        );
        urlPadron = res.url;
      }

      // 2. Lógica de Variación de Email
      let emailFinal = dto.email;
      let existe = await this.usuarioRepositorio.buscarPorEmail(emailFinal);
      let contador = 1;

      while (existe) {
        const [userPart, domainPart] = dto.email.split('@');
        emailFinal = `${userPart}${contador}@${domainPart}`;
        existe = await this.usuarioRepositorio.buscarPorEmail(emailFinal);
        contador++;
      }

      // 3. Crear Usuario
      const hashedPass = await bcrypt.hash(dto.passwordGenerado, 10);
      const usuario = queryRunner.manager.create(UsuarioFuenteDatos, {
        id: uuidv4(),
        nombre: dto.nombreEmpresa,
        email: emailFinal,
        password: hashedPass,
        rol: dto.rol || 'constructor',
      });
      const usuarioGuardado = await queryRunner.manager.save(UsuarioFuenteDatos, usuario);

      // 4. Crear Socio con todos los campos
      const socioData: Partial<SocioFuenteDatos> = {
        id: uuidv4(),
        usuario_id: usuarioGuardado.id,
        nombre_empresa: dto.nombreEmpresa,
        nit: dto.nit,
        representante_legal: dto.representanteLegal,
        telefono: dto.telefono,
        especialidades: dto.especialidades,
        maquinaria: dto.maquinaria,
        archivo_testimonio_url: urlTestimonio || undefined,
        archivo_padron_url: urlPadron || undefined,
      };
      const socio = queryRunner.manager.create(SocioFuenteDatos, socioData);
      await queryRunner.manager.save(SocioFuenteDatos, socio);

      await queryRunner.commitTransaction();

      return {
        success: true,
        mensaje: 'Constructor registrado exitosamente con toda su documentación',
        data: {
          email: emailFinal,
          password: dto.passwordGenerado,
          empresa: dto.nombreEmpresa,
          urls: { testimonio: urlTestimonio, padron: urlPadron }
        }
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.error('Error en RegistrarSocioUseCase:', err);
      throw new InternalServerErrorException('Error al registrar el socio: ' + err.message);
    } finally {
      await queryRunner.release();
    }
  }
}

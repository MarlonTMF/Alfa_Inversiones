import { Proyecto } from '../../data/fuentes-datos/proyecto.fuente-datos.js';
import { ProyectoFase } from '../../data/fuentes-datos/proyecto-fase.fuente-datos.js';
import { ProyectoMetrica } from '../../data/fuentes-datos/proyecto-metrica.fuente-datos.js';
import { ProyectoDocumento } from '../../data/fuentes-datos/proyecto-documento.fuente-datos.js';
import { ProyectoMultimedia } from '../../data/fuentes-datos/proyecto-multimedia.fuente-datos.js';

export interface ProyectoRepository {
  // CRUD básico
  create(proyecto: Partial<Proyecto>): Promise<Proyecto>;
  findById(id: string): Promise<Proyecto | null>;
  findAll(): Promise<Proyecto[]>;
  update(id: string, proyecto: Partial<Proyecto>): Promise<Proyecto>;
  delete(id: string): Promise<void>;

  // Consultas específicas
  findByEstado(estado: string): Promise<Proyecto[]>;
  findByPropertyId(propertyId: string): Promise<Proyecto | null>;
  findByConstructorId(constructorId: string): Promise<Proyecto[]>;

  // Fases
  createFase(fase: Partial<ProyectoFase>): Promise<ProyectoFase>;
  findFasesByProyectoId(proyectoId: string): Promise<ProyectoFase[]>;
  updateFase(id: string, fase: Partial<ProyectoFase>): Promise<ProyectoFase>;

  // Métricas
  createMetrica(metrica: Partial<ProyectoMetrica>): Promise<ProyectoMetrica>;
  findMetricasByProyectoId(proyectoId: string): Promise<ProyectoMetrica[]>;
  getUltimaMetrica(proyectoId: string): Promise<ProyectoMetrica | null>;

  // Documentos
  createDocumento(
    documento: Partial<ProyectoDocumento>,
  ): Promise<ProyectoDocumento>;
  findDocumentosByProyectoId(proyectoId: string): Promise<ProyectoDocumento[]>;

  // Multimedia
  createMultimedia(
    multimedia: Partial<ProyectoMultimedia>,
  ): Promise<ProyectoMultimedia>;
  findMultimediaByProyectoId(proyectoId: string): Promise<ProyectoMultimedia[]>;
  deleteMultimedia(id: string): Promise<void>;
  updateMultimedia(
    id: string,
    multimedia: Partial<ProyectoMultimedia>,
  ): Promise<ProyectoMultimedia>;
}

export const PROYECTO_REPOSITORIO = Symbol('PROYECTO_REPOSITORIO');

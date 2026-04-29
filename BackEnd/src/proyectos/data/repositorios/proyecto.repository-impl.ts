import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proyecto } from '../../data/fuentes-datos/proyecto.fuente-datos.js';
import { ProyectoFase } from '../../data/fuentes-datos/proyecto-fase.fuente-datos.js';
import { ProyectoMetrica } from '../../data/fuentes-datos/proyecto-metrica.fuente-datos.js';
import { ProyectoDocumento } from '../../data/fuentes-datos/proyecto-documento.fuente-datos.js';
import { ProyectoRepository } from '../../domain/interfaces/proyecto.repository.js';

@Injectable()
export class ProyectoRepositoryImpl implements ProyectoRepository {
  constructor(
    @InjectRepository(Proyecto)
    private readonly proyectoRepo: Repository<Proyecto>,
    @InjectRepository(ProyectoFase)
    private readonly faseRepo: Repository<ProyectoFase>,
    @InjectRepository(ProyectoMetrica)
    private readonly metricaRepo: Repository<ProyectoMetrica>,
    @InjectRepository(ProyectoDocumento)
    private readonly documentoRepo: Repository<ProyectoDocumento>,
  ) {}

  // CRUD básico
  async create(proyecto: Partial<Proyecto>): Promise<Proyecto> {
    const nuevo = this.proyectoRepo.create(proyecto);
    return this.proyectoRepo.save(nuevo);
  }

  async findById(id: string): Promise<Proyecto | null> {
    return this.proyectoRepo.findOne({
      where: { id },
      relations: ['property', 'constructorSocio', 'creator'],
    });
  }

  async findAll(): Promise<Proyecto[]> {
    return this.proyectoRepo.find({
      relations: ['property', 'constructorSocio', 'creator'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, proyecto: Partial<Proyecto>): Promise<Proyecto> {
    await this.proyectoRepo.update(id, proyecto);
    const actualizado = await this.findById(id);
    if (!actualizado) throw new NotFoundException('Proyecto no encontrado');
    return actualizado;
  }

  async delete(id: string): Promise<void> {
    await this.proyectoRepo.delete(id);
  }

  // Consultas específicas
  async findByEstado(estado: string): Promise<Proyecto[]> {
    return this.proyectoRepo.find({
      where: { estado },
      relations: ['property', 'constructorSocio', 'creator'],
    });
  }

  async findByPropertyId(propertyId: string): Promise<Proyecto | null> {
    return this.proyectoRepo.findOne({
      where: { propertyId },
      relations: ['property', 'constructorSocio', 'creator'],
    });
  }

  async findByConstructorId(constructorId: string): Promise<Proyecto[]> {
    return this.proyectoRepo.find({
      where: { constructorId },
      relations: ['property', 'constructorSocio', 'creator'],
    });
  }

  // Fases
  async createFase(fase: Partial<ProyectoFase>): Promise<ProyectoFase> {
    const nueva = this.faseRepo.create(fase);
    return this.faseRepo.save(nueva);
  }

  async findFasesByProyectoId(proyectoId: string): Promise<ProyectoFase[]> {
    return this.faseRepo.find({
      where: { proyectoId },
      order: { orden: 'ASC' },
    });
  }

  async updateFase(
    id: string,
    fase: Partial<ProyectoFase>,
  ): Promise<ProyectoFase> {
    await this.faseRepo.update(id, fase);
    const actualizada = await this.faseRepo.findOne({ where: { id } });
    if (!actualizada) throw new NotFoundException('Fase no encontrada');
    return actualizada;
  }

  // Métricas
  async createMetrica(
    metrica: Partial<ProyectoMetrica>,
  ): Promise<ProyectoMetrica> {
    const nueva = this.metricaRepo.create(metrica);
    return this.metricaRepo.save(nueva);
  }

  async findMetricasByProyectoId(
    proyectoId: string,
  ): Promise<ProyectoMetrica[]> {
    return this.metricaRepo.find({
      where: { proyectoId },
      order: { fecha: 'DESC' },
    });
  }

  async getUltimaMetrica(proyectoId: string): Promise<ProyectoMetrica | null> {
    return this.metricaRepo.findOne({
      where: { proyectoId },
      order: { fecha: 'DESC' },
    });
  }

  // Documentos
  async createDocumento(
    documento: Partial<ProyectoDocumento>,
  ): Promise<ProyectoDocumento> {
    const nuevo = this.documentoRepo.create(documento);
    return this.documentoRepo.save(nuevo);
  }

  async findDocumentosByProyectoId(
    proyectoId: string,
  ): Promise<ProyectoDocumento[]> {
    return this.documentoRepo.find({
      where: { proyectoId },
      order: { createdAt: 'DESC' },
    });
  }
}

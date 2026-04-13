import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaFiltros } from './mapa-filtros';

describe('MapaFiltros', () => {
  let component: MapaFiltros;
  let fixture: ComponentFixture<MapaFiltros>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapaFiltros],
    }).compileComponents();

    fixture = TestBed.createComponent(MapaFiltros);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

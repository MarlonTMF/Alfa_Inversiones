import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasoEspecificaciones } from './paso-especificaciones';

describe('PasoEspecificaciones', () => {
  let component: PasoEspecificaciones;
  let fixture: ComponentFixture<PasoEspecificaciones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasoEspecificaciones],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoEspecificaciones);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionEmpresas } from './gestion-empresas';

describe('GestionEmpresas', () => {
  let component: GestionEmpresas;
  let fixture: ComponentFixture<GestionEmpresas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionEmpresas],
    }).compileComponents();

    fixture = TestBed.createComponent(GestionEmpresas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

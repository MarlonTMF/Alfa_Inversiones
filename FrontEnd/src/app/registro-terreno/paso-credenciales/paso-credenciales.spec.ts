import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasoCredenciales } from './paso-credenciales';

describe('PasoCredenciales', () => {
  let component: PasoCredenciales;
  let fixture: ComponentFixture<PasoCredenciales>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasoCredenciales],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoCredenciales);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

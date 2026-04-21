import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroSocio } from './registro-socio';

describe('RegistroSocio', () => {
  let component: RegistroSocio;
  let fixture: ComponentFixture<RegistroSocio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroSocio],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroSocio);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

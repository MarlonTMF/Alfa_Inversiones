import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroTerreno } from './registro-terreno';

describe('RegistroTerreno', () => {
  let component: RegistroTerreno;
  let fixture: ComponentFixture<RegistroTerreno>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroTerreno],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroTerreno);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

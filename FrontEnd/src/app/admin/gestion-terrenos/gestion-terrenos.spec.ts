import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionTerrenos } from './gestion-terrenos';

describe('GestionTerrenos', () => {
  let component: GestionTerrenos;
  let fixture: ComponentFixture<GestionTerrenos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionTerrenos],
    }).compileComponents();

    fixture = TestBed.createComponent(GestionTerrenos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

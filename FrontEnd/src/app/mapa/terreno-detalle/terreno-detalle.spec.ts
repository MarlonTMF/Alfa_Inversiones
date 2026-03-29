import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerrenoDetalle } from './terreno-detalle';

describe('TerrenoDetalle', () => {
  let component: TerrenoDetalle;
  let fixture: ComponentFixture<TerrenoDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerrenoDetalle],
    }).compileComponents();

    fixture = TestBed.createComponent(TerrenoDetalle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

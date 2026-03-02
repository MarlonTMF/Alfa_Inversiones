import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerrenoPopup } from './terreno-popup';

describe('TerrenoPopup', () => {
  let component: TerrenoPopup;
  let fixture: ComponentFixture<TerrenoPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerrenoPopup],
    }).compileComponents();

    fixture = TestBed.createComponent(TerrenoPopup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

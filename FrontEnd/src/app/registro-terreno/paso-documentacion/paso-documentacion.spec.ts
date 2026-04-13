import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasoDocumentacion } from './paso-documentacion';

describe('PasoDocumentacion', () => {
  let component: PasoDocumentacion;
  let fixture: ComponentFixture<PasoDocumentacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasoDocumentacion],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoDocumentacion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

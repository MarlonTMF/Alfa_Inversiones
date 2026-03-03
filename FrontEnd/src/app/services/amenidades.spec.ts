import { TestBed } from '@angular/core/testing';

import { Amenidades } from './amenidades';

describe('Amenidades', () => {
  let service: Amenidades;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Amenidades);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

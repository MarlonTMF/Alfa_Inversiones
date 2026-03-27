import { TestBed } from '@angular/core/testing';

import { Explorador } from './explorador';

describe('Explorador', () => {
  let service: Explorador;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Explorador);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

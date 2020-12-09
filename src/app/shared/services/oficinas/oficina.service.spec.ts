import { TestBed, inject } from '@angular/core/testing';

import { OficinaService } from './oficina.service';

describe('OficinaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OficinaService]
    });
  });

  it('should be created', inject([OficinaService], (service: OficinaService) => {
    expect(service).toBeTruthy();
  }));
});

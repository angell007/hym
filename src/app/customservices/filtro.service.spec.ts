import { TestBed, inject } from '@angular/core/testing';

import { FiltroService } from './filtro.service';

describe('FiltroService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FiltroService]
    });
  });

  it('should be created', inject([FiltroService], (service: FiltroService) => {
    expect(service).toBeTruthy();
  }));
});

import { TestBed, inject } from '@angular/core/testing';

import { ConsolidadosService } from './consolidados.service';

describe('ConsolidadosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConsolidadosService]
    });
  });

  it('should be created', inject([ConsolidadosService], (service: ConsolidadosService) => {
    expect(service).toBeTruthy();
  }));
});

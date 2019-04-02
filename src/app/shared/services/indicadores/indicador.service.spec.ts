import { TestBed, inject } from '@angular/core/testing';

import { IndicadorService } from './indicador.service';

describe('IndicadorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IndicadorService]
    });
  });

  it('should be created', inject([IndicadorService], (service: IndicadorService) => {
    expect(service).toBeTruthy();
  }));
});

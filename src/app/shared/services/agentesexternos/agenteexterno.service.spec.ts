import { TestBed, inject } from '@angular/core/testing';

import { AgenteexternoService } from './agenteexterno.service';

describe('AgenteexternoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AgenteexternoService]
    });
  });

  it('should be created', inject([AgenteexternoService], (service: AgenteexternoService) => {
    expect(service).toBeTruthy();
  }));
});

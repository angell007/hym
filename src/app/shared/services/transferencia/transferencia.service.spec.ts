import { TestBed, inject } from '@angular/core/testing';

import { TransferenciaService } from './transferencia.service';

describe('TransferenciaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransferenciaService]
    });
  });

  it('should be created', inject([TransferenciaService], (service: TransferenciaService) => {
    expect(service).toBeTruthy();
  }));
});

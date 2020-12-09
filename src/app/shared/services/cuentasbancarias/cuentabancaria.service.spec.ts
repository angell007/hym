import { TestBed, inject } from '@angular/core/testing';

import { CuentabancariaService } from './cuentabancaria.service';

describe('CuentabancariaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CuentabancariaService]
    });
  });

  it('should be created', inject([CuentabancariaService], (service: CuentabancariaService) => {
    expect(service).toBeTruthy();
  }));
});

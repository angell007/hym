import { TestBed, inject } from '@angular/core/testing';

import { TipocuentaService } from './tipocuenta.service';

describe('TipocuentaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TipocuentaService]
    });
  });

  it('should be created', inject([TipocuentaService], (service: TipocuentaService) => {
    expect(service).toBeTruthy();
  }));
});

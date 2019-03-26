import { TestBed, inject } from '@angular/core/testing';

import { CajarecaudoService } from './cajarecaudo.service';

describe('CajarecaudoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CajarecaudoService]
    });
  });

  it('should be created', inject([CajarecaudoService], (service: CajarecaudoService) => {
    expect(service).toBeTruthy();
  }));
});

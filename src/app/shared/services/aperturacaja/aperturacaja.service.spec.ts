import { TestBed, inject } from '@angular/core/testing';

import { AperturacajaService } from './aperturacaja.service';

describe('AperturacajaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AperturacajaService]
    });
  });

  it('should be created', inject([AperturacajaService], (service: AperturacajaService) => {
    expect(service).toBeTruthy();
  }));
});

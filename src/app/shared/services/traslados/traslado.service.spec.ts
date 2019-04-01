import { TestBed, inject } from '@angular/core/testing';

import { TrasladoService } from './traslado.service';

describe('TrasladoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TrasladoService]
    });
  });

  it('should be created', inject([TrasladoService], (service: TrasladoService) => {
    expect(service).toBeTruthy();
  }));
});

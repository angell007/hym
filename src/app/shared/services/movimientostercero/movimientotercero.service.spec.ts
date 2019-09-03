import { TestBed, inject } from '@angular/core/testing';

import { MovimientoterceroService } from './movimientotercero.service';

describe('MovimientoterceroService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MovimientoterceroService]
    });
  });

  it('should be created', inject([MovimientoterceroService], (service: MovimientoterceroService) => {
    expect(service).toBeTruthy();
  }));
});

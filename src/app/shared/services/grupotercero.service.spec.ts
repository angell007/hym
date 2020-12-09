import { TestBed, inject } from '@angular/core/testing';

import { GrupoterceroService } from './grupotercero.service';

describe('GrupoterceroService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GrupoterceroService]
    });
  });

  it('should be created', inject([GrupoterceroService], (service: GrupoterceroService) => {
    expect(service).toBeTruthy();
  }));
});

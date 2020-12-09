import { TestBed, inject } from '@angular/core/testing';

import { CajeroService } from './cajero.service';

describe('CajeroService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CajeroService]
    });
  });

  it('should be created', inject([CajeroService], (service: CajeroService) => {
    expect(service).toBeTruthy();
  }));
});

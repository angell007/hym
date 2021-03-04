import { TestBed, inject } from '@angular/core/testing';

import { ValidateCajeroService } from './validate-cajero.service';

describe('ValidateCajeroService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValidateCajeroService]
    });
  });

  it('should be created', inject([ValidateCajeroService], (service: ValidateCajeroService) => {
    expect(service).toBeTruthy();
  }));
});

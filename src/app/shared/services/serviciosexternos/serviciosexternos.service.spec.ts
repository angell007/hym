import { TestBed, inject } from '@angular/core/testing';

import { ServiciosexternosService } from './serviciosexternos.service';

describe('ServiciosexternosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServiciosexternosService]
    });
  });

  it('should be created', inject([ServiciosexternosService], (service: ServiciosexternosService) => {
    expect(service).toBeTruthy();
  }));
});

import { TestBed, inject } from '@angular/core/testing';

import { SexternosService } from './sexternos.service';

describe('SexternosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SexternosService]
    });
  });

  it('should be created', inject([SexternosService], (service: SexternosService) => {
    expect(service).toBeTruthy();
  }));
});

import { TestBed, inject } from '@angular/core/testing';

import { CambioServiceService } from './cambio-service.service';

describe('CambioServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CambioServiceService]
    });
  });

  it('should be created', inject([CambioServiceService], (service: CambioServiceService) => {
    expect(service).toBeTruthy();
  }));
});

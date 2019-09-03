import { TestBed, inject } from '@angular/core/testing';

import { RemitenteService } from './remitente.service';

describe('RemitenteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RemitenteService]
    });
  });

  it('should be created', inject([RemitenteService], (service: RemitenteService) => {
    expect(service).toBeTruthy();
  }));
});

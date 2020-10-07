import { TestBed, inject } from '@angular/core/testing';

import { TransferenciasconsultorService } from './transferenciasconsultor.service';

describe('TransferenciasconsultorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransferenciasconsultorService]
    });
  });

  it('should be created', inject([TransferenciasconsultorService], (service: TransferenciasconsultorService) => {
    expect(service).toBeTruthy();
  }));
});

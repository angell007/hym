import { TestBed, inject } from '@angular/core/testing';

import { CompraService } from './compra.service';

describe('CompraService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompraService]
    });
  });

  it('should be created', inject([CompraService], (service: CompraService) => {
    expect(service).toBeTruthy();
  }));
});

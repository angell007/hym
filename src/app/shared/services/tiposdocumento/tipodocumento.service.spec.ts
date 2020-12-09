import { TestBed, inject } from '@angular/core/testing';

import { TipodocumentoService } from './tipodocumento.service';

describe('TipodocumentoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TipodocumentoService]
    });
  });

  it('should be created', inject([TipodocumentoService], (service: TipodocumentoService) => {
    expect(service).toBeTruthy();
  }));
});

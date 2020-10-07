import { TestBed, inject } from '@angular/core/testing';

import { TrasladosCustomService } from './traslados.custom.service';

describe('Traslados.CustomService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TrasladosCustomService]
    });
  });

  it('should be created', inject([TrasladosCustomService], (service: TrasladosCustomService) => {
    expect(service).toBeTruthy();
  }));
});

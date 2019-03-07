import { TestBed, inject } from '@angular/core/testing';

import { TrasladocajaService } from './trasladocaja.service';

describe('TrasladocajaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TrasladocajaService]
    });
  });

  it('should be created', inject([TrasladocajaService], (service: TrasladocajaService) => {
    expect(service).toBeTruthy();
  }));
});

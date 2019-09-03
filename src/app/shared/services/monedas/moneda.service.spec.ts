import { TestBed, inject } from '@angular/core/testing';

import { MonedaService } from './moneda.service';

describe('MonedaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MonedaService]
    });
  });

  it('should be created', inject([MonedaService], (service: MonedaService) => {
    expect(service).toBeTruthy();
  }));
});

import { TestBed, inject } from '@angular/core/testing';

import { TrasladofilterService } from './trasladofilter.service';

describe('TrasladofilterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TrasladofilterService]
    });
  });

  it('should be created', inject([TrasladofilterService], (service: TrasladofilterService) => {
    expect(service).toBeTruthy();
  }));
});

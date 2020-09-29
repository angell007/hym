import { TestBed, inject } from '@angular/core/testing';

import { TesCustomServiceService } from './tes-custom-service.service';

describe('TesCustomServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TesCustomServiceService]
    });
  });

  it('should be created', inject([TesCustomServiceService], (service: TesCustomServiceService) => {
    expect(service).toBeTruthy();
  }));
});

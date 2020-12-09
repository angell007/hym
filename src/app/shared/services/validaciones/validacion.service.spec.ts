import { TestBed, inject } from '@angular/core/testing';

import { ValidacionService } from './validacion.service';

describe('ValidacionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValidacionService]
    });
  });

  it('should be created', inject([ValidacionService], (service: ValidacionService) => {
    expect(service).toBeTruthy();
  }));
});

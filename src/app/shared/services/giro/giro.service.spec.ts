import { TestBed, inject } from '@angular/core/testing';

import { GiroService } from './giro.service';

describe('GiroService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GiroService]
    });
  });

  it('should be created', inject([GiroService], (service: GiroService) => {
    expect(service).toBeTruthy();
  }));
});

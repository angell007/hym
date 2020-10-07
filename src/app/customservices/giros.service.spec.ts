import { TestBed, inject } from '@angular/core/testing';

import { GirosService } from './giros.service';

describe('GirosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GirosService]
    });
  });

  it('should be created', inject([GirosService], (service: GirosService) => {
    expect(service).toBeTruthy();
  }));
});

import { TestBed, inject } from '@angular/core/testing';

import { HandlerrouteService } from './handlerroute.service';

describe('HandlerrouteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HandlerrouteService]
    });
  });

  it('should be created', inject([HandlerrouteService], (service: HandlerrouteService) => {
    expect(service).toBeTruthy();
  }));
});

import { TestBed, inject } from '@angular/core/testing';

import { NormailizerService } from './normailizer.service';

describe('NormailizerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NormailizerService]
    });
  });

  it('should be created', inject([NormailizerService], (service: NormailizerService) => {
    expect(service).toBeTruthy();
  }));
});

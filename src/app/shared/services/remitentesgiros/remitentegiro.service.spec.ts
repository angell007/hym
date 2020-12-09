import { TestBed, inject } from '@angular/core/testing';

import { RemitentegiroService } from './remitentegiro.service';

describe('RemitentegiroService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RemitentegiroService]
    });
  });

  it('should be created', inject([RemitentegiroService], (service: RemitentegiroService) => {
    expect(service).toBeTruthy();
  }));
});

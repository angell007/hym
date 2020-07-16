import { TestBed, inject } from '@angular/core/testing';

import { WebnavigationService } from './webnavigation.service';

describe('WebnavigationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WebnavigationService]
    });
  });

  it('should be created', inject([WebnavigationService], (service: WebnavigationService) => {
    expect(service).toBeTruthy();
  }));
});

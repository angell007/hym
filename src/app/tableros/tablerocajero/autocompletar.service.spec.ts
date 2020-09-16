import { TestBed, inject } from '@angular/core/testing';

import { AutocompletarService } from './autocompletar.service';

describe('AutocompletarService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AutocompletarService]
    });
  });

  it('should be created', inject([AutocompletarService], (service: AutocompletarService) => {
    expect(service).toBeTruthy();
  }));
});

import { TestBed, inject } from '@angular/core/testing';

import { CorresponsalbancarioService } from './corresponsalbancario.service';

describe('CorresponsalbancarioService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CorresponsalbancarioService]
    });
  });

  it('should be created', inject([CorresponsalbancarioService], (service: CorresponsalbancarioService) => {
    expect(service).toBeTruthy();
  }));
});

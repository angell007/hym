import { TestBed, inject } from '@angular/core/testing';

import { DependenciaService } from './dependencia.service';

describe('DependenciaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DependenciaService]
    });
  });

  it('should be created', inject([DependenciaService], (service: DependenciaService) => {
    expect(service).toBeTruthy();
  }));
});

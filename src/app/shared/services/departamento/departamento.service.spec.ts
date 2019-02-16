import { TestBed, inject } from '@angular/core/testing';

import { DepartamentoService } from './departamento.service';

describe('DepartamentoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DepartamentoService]
    });
  });

  it('should be created', inject([DepartamentoService], (service: DepartamentoService) => {
    expect(service).toBeTruthy();
  }));
});

import { TestBed, inject } from '@angular/core/testing';

import { NuevofuncionarioService } from './nuevofuncionario.service';

describe('NuevofuncionarioService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NuevofuncionarioService]
    });
  });

  it('should be created', inject([NuevofuncionarioService], (service: NuevofuncionarioService) => {
    expect(service).toBeTruthy();
  }));
});

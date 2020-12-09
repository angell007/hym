import { TestBed, inject } from '@angular/core/testing';

import { ConfiguracionService } from './configuracion.service';

describe('ConfiguracionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfiguracionService]
    });
  });

  it('should be created', inject([ConfiguracionService], (service: ConfiguracionService) => {
    expect(service).toBeTruthy();
  }));
});

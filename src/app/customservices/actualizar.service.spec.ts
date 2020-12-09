import { TestBed, inject } from '@angular/core/testing';

import { ActualizarService } from './actualizar.service';

describe('ActualizarService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActualizarService]
    });
  });

  it('should be created', inject([ActualizarService], (service: ActualizarService) => {
    expect(service).toBeTruthy();
  }));
});

import { TestBed, inject } from '@angular/core/testing';

import { DestinatariogiroService } from './destinatariogiro.service';

describe('DestinatariogiroService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DestinatariogiroService]
    });
  });

  it('should be created', inject([DestinatariogiroService], (service: DestinatariogiroService) => {
    expect(service).toBeTruthy();
  }));
});

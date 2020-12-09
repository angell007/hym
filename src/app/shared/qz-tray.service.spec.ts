import { TestBed, inject } from '@angular/core/testing';

import { QzTrayService } from './qz-tray.service';

describe('QzTrayService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QzTrayService]
    });
  });

  it('should be created', inject([QzTrayService], (service: QzTrayService) => {
    expect(service).toBeTruthy();
  }));
});

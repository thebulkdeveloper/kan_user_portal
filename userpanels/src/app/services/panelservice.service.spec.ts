import { TestBed } from '@angular/core/testing';

import { PanelserviceService } from './panelservice.service';

describe('PanelserviceService', () => {
  let service: PanelserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PanelserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

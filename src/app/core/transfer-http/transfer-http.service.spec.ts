import { TestBed } from '@angular/core/testing';

import { TransferHttpService } from './transfer-http.service';

describe('TransferHttpService', () => {
  let service: TransferHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransferHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

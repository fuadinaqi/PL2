import { TestBed } from '@angular/core/testing';

import { AlamatService } from './alamat.service';

describe('AlamatService', () => {
  let service: AlamatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlamatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed, inject } from '@angular/core/testing';

import { RuleServiceV2013Service } from './rule-service-v2013.service';

describe('RuleServiceV2013Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RuleServiceV2013Service]
    });
  });

  it('should be created', inject([RuleServiceV2013Service], (service: RuleServiceV2013Service) => {
    expect(service).toBeTruthy();
  }));
});

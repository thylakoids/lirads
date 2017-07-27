import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { V2013Component } from './v2013.component';

describe('V2013Component', () => {
  let component: V2013Component;
  let fixture: ComponentFixture<V2013Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ V2013Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(V2013Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

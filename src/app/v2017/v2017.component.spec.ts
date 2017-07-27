import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { V2017Component } from './v2017.component';

describe('V2017Component', () => {
  let component: V2017Component;
  let fixture: ComponentFixture<V2017Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ V2017Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(V2017Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

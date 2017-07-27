import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { V2014Component } from './v2014.component';

describe('V2014Component', () => {
  let component: V2014Component;
  let fixture: ComponentFixture<V2014Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ V2014Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(V2014Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

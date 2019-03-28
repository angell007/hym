import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablatotalesmonedaterceroComponent } from './tablatotalesmonedatercero.component';

describe('TablatotalesmonedaterceroComponent', () => {
  let component: TablatotalesmonedaterceroComponent;
  let fixture: ComponentFixture<TablatotalesmonedaterceroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablatotalesmonedaterceroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablatotalesmonedaterceroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablatotalesmonedasComponent } from './tablatotalesmonedas.component';

describe('TablatotalesmonedasComponent', () => {
  let component: TablatotalesmonedasComponent;
  let fixture: ComponentFixture<TablatotalesmonedasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablatotalesmonedasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablatotalesmonedasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablatotalesterceroComponent } from './tablatotalestercero.component';

describe('TablatotalesterceroComponent', () => {
  let component: TablatotalesterceroComponent;
  let fixture: ComponentFixture<TablatotalesterceroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablatotalesterceroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablatotalesterceroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

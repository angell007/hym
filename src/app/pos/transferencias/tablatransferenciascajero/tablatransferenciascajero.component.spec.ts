import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablatransferenciascajeroComponent } from './tablatransferenciascajero.component';

describe('TablatransferenciascajeroComponent', () => {
  let component: TablatransferenciascajeroComponent;
  let fixture: ComponentFixture<TablatransferenciascajeroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablatransferenciascajeroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablatransferenciascajeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

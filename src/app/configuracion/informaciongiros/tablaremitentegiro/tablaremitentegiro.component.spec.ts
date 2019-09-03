import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaremitentegiroComponent } from './tablaremitentegiro.component';

describe('TablaremitentegiroComponent', () => {
  let component: TablaremitentegiroComponent;
  let fixture: ComponentFixture<TablaremitentegiroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaremitentegiroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaremitentegiroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

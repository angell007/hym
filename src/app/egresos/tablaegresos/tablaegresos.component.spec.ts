import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaegresosComponent } from './tablaegresos.component';

describe('TablaegresosComponent', () => {
  let component: TablaegresosComponent;
  let fixture: ComponentFixture<TablaegresosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaegresosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaegresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaverterceroComponent } from './tablavertercero.component';

describe('TablaverterceroComponent', () => {
  let component: TablaverterceroComponent;
  let fixture: ComponentFixture<TablaverterceroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaverterceroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaverterceroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

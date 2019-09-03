import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaresumentotalizadoComponent } from './tablaresumentotalizado.component';

describe('TablaresumentotalizadoComponent', () => {
  let component: TablaresumentotalizadoComponent;
  let fixture: ComponentFixture<TablaresumentotalizadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaresumentotalizadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaresumentotalizadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

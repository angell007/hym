import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablatasladoscajaComponent } from './tablatasladoscaja.component';

describe('TablatasladoscajaComponent', () => {
  let component: TablatasladoscajaComponent;
  let fixture: ComponentFixture<TablatasladoscajaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablatasladoscajaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablatasladoscajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

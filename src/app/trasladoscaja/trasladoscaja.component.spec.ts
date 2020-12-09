import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrasladoscajaComponent } from './trasladoscaja.component';

describe('TrasladoscajaComponent', () => {
  let component: TrasladoscajaComponent;
  let fixture: ComponentFixture<TrasladoscajaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrasladoscajaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrasladoscajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

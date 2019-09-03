import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalcajaComponent } from './modalcaja.component';

describe('ModalcajaComponent', () => {
  let component: ModalcajaComponent;
  let fixture: ComponentFixture<ModalcajaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalcajaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalcajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

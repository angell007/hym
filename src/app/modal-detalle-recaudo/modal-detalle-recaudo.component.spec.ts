import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetalleRecaudoComponent } from './modal-detalle-recaudo.component';

describe('ModalDetalleRecaudoComponent', () => {
  let component: ModalDetalleRecaudoComponent;
  let fixture: ComponentFixture<ModalDetalleRecaudoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDetalleRecaudoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDetalleRecaudoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

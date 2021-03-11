import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetalleAjusteComponent } from './modal-detalle-ajuste.component';

describe('ModalDetalleAjusteComponent', () => {
  let component: ModalDetalleAjusteComponent;
  let fixture: ComponentFixture<ModalDetalleAjusteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDetalleAjusteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDetalleAjusteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

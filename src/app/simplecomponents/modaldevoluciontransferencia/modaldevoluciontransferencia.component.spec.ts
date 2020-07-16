import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaldevoluciontransferenciaComponent } from './modaldevoluciontransferencia.component';

describe('ModaldevoluciontransferenciaComponent', () => {
  let component: ModaldevoluciontransferenciaComponent;
  let fixture: ComponentFixture<ModaldevoluciontransferenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModaldevoluciontransferenciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModaldevoluciontransferenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

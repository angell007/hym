import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaldestinatarioEditarComponent } from './modaldestinatario-editar.component';

describe('ModaldestinatarioEditarComponent', () => {
  let component: ModaldestinatarioEditarComponent;
  let fixture: ComponentFixture<ModaldestinatarioEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModaldestinatarioEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModaldestinatarioEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

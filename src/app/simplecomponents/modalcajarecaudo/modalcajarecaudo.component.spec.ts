import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalcajarecaudoComponent } from './modalcajarecaudo.component';

describe('ModalcajarecaudoComponent', () => {
  let component: ModalcajarecaudoComponent;
  let fixture: ComponentFixture<ModalcajarecaudoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalcajarecaudoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalcajarecaudoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

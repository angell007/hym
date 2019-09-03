import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalcuentabancariaComponent } from './modalcuentabancaria.component';

describe('ModalcuentabancariaComponent', () => {
  let component: ModalcuentabancariaComponent;
  let fixture: ComponentFixture<ModalcuentabancariaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalcuentabancariaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalcuentabancariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

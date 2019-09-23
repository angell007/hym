import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalajustecuentaComponent } from './modalajustecuenta.component';

describe('ModalajustecuentaComponent', () => {
  let component: ModalajustecuentaComponent;
  let fixture: ComponentFixture<ModalajustecuentaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalajustecuentaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalajustecuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

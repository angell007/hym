import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentasbancariasComponent } from './cuentasbancarias.component';

describe('CuentasbancariasComponent', () => {
  let component: CuentasbancariasComponent;
  let fixture: ComponentFixture<CuentasbancariasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuentasbancariasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuentasbancariasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentasbancariasverComponent } from './cuentasbancariasver.component';

describe('CuentasbancariasverComponent', () => {
  let component: CuentasbancariasverComponent;
  let fixture: ComponentFixture<CuentasbancariasverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuentasbancariasverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuentasbancariasverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

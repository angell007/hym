import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentastercerosComponent } from './cuentasterceros.component';

describe('CuentastercerosComponent', () => {
  let component: CuentastercerosComponent;
  let fixture: ComponentFixture<CuentastercerosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuentastercerosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuentastercerosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

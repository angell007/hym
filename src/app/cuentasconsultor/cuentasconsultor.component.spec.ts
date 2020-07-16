import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentasconsultorComponent } from './cuentasconsultor.component';

describe('CuentasconsultorComponent', () => {
  let component: CuentasconsultorComponent;
  let fixture: ComponentFixture<CuentasconsultorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuentasconsultorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuentasconsultorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

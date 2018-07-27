import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentascobrarComponent } from './cuentascobrar.component';

describe('CuentascobrarComponent', () => {
  let component: CuentascobrarComponent;
  let fixture: ComponentFixture<CuentascobrarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuentascobrarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuentascobrarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

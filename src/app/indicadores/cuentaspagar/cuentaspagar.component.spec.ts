import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentaspagarComponent } from './cuentaspagar.component';

describe('CuentaspagarComponent', () => {
  let component: CuentaspagarComponent;
  let fixture: ComponentFixture<CuentaspagarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuentaspagarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuentaspagarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

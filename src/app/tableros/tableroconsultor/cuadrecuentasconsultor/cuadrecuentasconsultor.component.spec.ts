import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuadrecuentasconsultorComponent } from './cuadrecuentasconsultor.component';

describe('CuadrecuentasconsultorComponent', () => {
  let component: CuadrecuentasconsultorComponent;
  let fixture: ComponentFixture<CuadrecuentasconsultorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuadrecuentasconsultorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuadrecuentasconsultorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

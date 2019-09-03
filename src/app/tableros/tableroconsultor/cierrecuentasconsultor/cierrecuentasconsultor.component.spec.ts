import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CierrecuentasconsultorComponent } from './cierrecuentasconsultor.component';

describe('CierrecuentasconsultorComponent', () => {
  let component: CierrecuentasconsultorComponent;
  let fixture: ComponentFixture<CierrecuentasconsultorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CierrecuentasconsultorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CierrecuentasconsultorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

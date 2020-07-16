import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AperturacuentasconsultorComponent } from './aperturacuentasconsultor.component';

describe('AperturacuentasconsultorComponent', () => {
  let component: AperturacuentasconsultorComponent;
  let fixture: ComponentFixture<AperturacuentasconsultorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AperturacuentasconsultorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AperturacuentasconsultorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

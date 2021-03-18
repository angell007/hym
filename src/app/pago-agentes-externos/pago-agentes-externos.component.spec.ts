import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoAgentesExternosComponent } from './pago-agentes-externos.component';

describe('PagoAgentesExternosComponent', () => {
  let component: PagoAgentesExternosComponent;
  let fixture: ComponentFixture<PagoAgentesExternosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagoAgentesExternosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagoAgentesExternosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

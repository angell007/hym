import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalletransferenciaComponent } from './detalletransferencia.component';

describe('DetalletransferenciaComponent', () => {
  let component: DetalletransferenciaComponent;
  let fixture: ComponentFixture<DetalletransferenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalletransferenciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalletransferenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

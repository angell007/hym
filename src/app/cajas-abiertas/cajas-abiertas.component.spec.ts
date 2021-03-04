import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CajasAbiertasComponent } from './cajas-abiertas.component';

describe('CajasAbiertasComponent', () => {
  let component: CajasAbiertasComponent;
  let fixture: ComponentFixture<CajasAbiertasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CajasAbiertasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CajasAbiertasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

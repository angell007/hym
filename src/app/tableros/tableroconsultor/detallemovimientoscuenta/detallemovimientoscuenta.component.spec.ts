import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallemovimientoscuentaComponent } from './detallemovimientoscuenta.component';

describe('DetallemovimientoscuentaComponent', () => {
  let component: DetallemovimientoscuentaComponent;
  let fixture: ComponentFixture<DetallemovimientoscuentaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetallemovimientoscuentaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallemovimientoscuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

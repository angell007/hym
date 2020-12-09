import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallemovimientoscuentagerenteComponent } from './detallemovimientoscuentagerente.component';

describe('DetallemovimientoscuentagerenteComponent', () => {
  let component: DetallemovimientoscuentagerenteComponent;
  let fixture: ComponentFixture<DetallemovimientoscuentagerenteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetallemovimientoscuentagerenteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallemovimientoscuentagerenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

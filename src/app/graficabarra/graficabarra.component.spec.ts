import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficabarraComponent } from './graficabarra.component';

describe('GraficabarraComponent', () => {
  let component: GraficabarraComponent;
  let fixture: ComponentFixture<GraficabarraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraficabarraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraficabarraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

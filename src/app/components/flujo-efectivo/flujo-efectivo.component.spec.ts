import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlujoEfectivoComponent } from './flujo-efectivo.component';

describe('FlujoEfectivoComponent', () => {
  let component: FlujoEfectivoComponent;
  let fixture: ComponentFixture<FlujoEfectivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlujoEfectivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlujoEfectivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

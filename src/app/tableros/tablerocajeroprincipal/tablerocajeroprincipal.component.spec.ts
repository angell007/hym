import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablerocajeroprincipalComponent } from './tablerocajeroprincipal.component';

describe('TablerocajeroprincipalComponent', () => {
  let component: TablerocajeroprincipalComponent;
  let fixture: ComponentFixture<TablerocajeroprincipalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablerocajeroprincipalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablerocajeroprincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

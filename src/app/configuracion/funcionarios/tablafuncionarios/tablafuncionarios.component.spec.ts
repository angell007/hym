import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablafuncionariosComponent } from './tablafuncionarios.component';

describe('TablafuncionariosComponent', () => {
  let component: TablafuncionariosComponent;
  let fixture: ComponentFixture<TablafuncionariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablafuncionariosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablafuncionariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

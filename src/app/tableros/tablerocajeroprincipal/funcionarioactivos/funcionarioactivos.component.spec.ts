import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuncionarioactivosComponent } from './funcionarioactivos.component';

describe('FuncionarioactivosComponent', () => {
  let component: FuncionarioactivosComponent;
  let fixture: ComponentFixture<FuncionarioactivosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuncionarioactivosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuncionarioactivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

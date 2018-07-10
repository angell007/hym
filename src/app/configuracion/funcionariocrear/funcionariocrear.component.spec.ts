import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuncionariocrearComponent } from './funcionariocrear.component';

describe('FuncionariocrearComponent', () => {
  let component: FuncionariocrearComponent;
  let fixture: ComponentFixture<FuncionariocrearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuncionariocrearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuncionariocrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

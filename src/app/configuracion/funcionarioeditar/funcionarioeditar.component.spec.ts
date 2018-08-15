import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuncionarioeditarComponent } from './funcionarioeditar.component';

describe('FuncionarioeditarComponent', () => {
  let component: FuncionarioeditarComponent;
  let fixture: ComponentFixture<FuncionarioeditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuncionarioeditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuncionarioeditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

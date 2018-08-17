import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuncionarioverComponent } from './funcionariover.component';

describe('FuncionarioverComponent', () => {
  let component: FuncionarioverComponent;
  let fixture: ComponentFixture<FuncionarioverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuncionarioverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuncionarioverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

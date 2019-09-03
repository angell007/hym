import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuncionarioinformativecardComponent } from './funcionarioinformativecard.component';

describe('FuncionarioinformativecardComponent', () => {
  let component: FuncionarioinformativecardComponent;
  let fixture: ComponentFixture<FuncionarioinformativecardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuncionarioinformativecardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuncionarioinformativecardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

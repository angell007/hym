import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformativetotalmonedatercerocardComponent } from './informativetotalmonedatercerocard.component';

describe('InformativetotalmonedatercerocardComponent', () => {
  let component: InformativetotalmonedatercerocardComponent;
  let fixture: ComponentFixture<InformativetotalmonedatercerocardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformativetotalmonedatercerocardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformativetotalmonedatercerocardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

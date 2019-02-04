import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformativecardComponent } from './informativecard.component';

describe('InformativecardComponent', () => {
  let component: InformativecardComponent;
  let fixture: ComponentFixture<InformativecardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformativecardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformativecardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OficinaverComponent } from './oficinaver.component';

describe('OficinaverComponent', () => {
  let component: OficinaverComponent;
  let fixture: ComponentFixture<OficinaverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OficinaverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OficinaverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

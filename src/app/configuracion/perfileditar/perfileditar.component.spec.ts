import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfileditarComponent } from './perfileditar.component';

describe('PerfileditarComponent', () => {
  let component: PerfileditarComponent;
  let fixture: ComponentFixture<PerfileditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerfileditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfileditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OficinaseditarComponent } from './oficinaseditar.component';

describe('OficinaseditarComponent', () => {
  let component: OficinaseditarComponent;
  let fixture: ComponentFixture<OficinaseditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OficinaseditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OficinaseditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

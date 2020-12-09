import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OficinascrearComponent } from './oficinascrear.component';

describe('OficinascrearComponent', () => {
  let component: OficinascrearComponent;
  let fixture: ComponentFixture<OficinascrearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OficinascrearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OficinascrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

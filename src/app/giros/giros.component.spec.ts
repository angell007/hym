import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GirosComponent } from './giros.component';

describe('GirosComponent', () => {
  let component: GirosComponent;
  let fixture: ComponentFixture<GirosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GirosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GirosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

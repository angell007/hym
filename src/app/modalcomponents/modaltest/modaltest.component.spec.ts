import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaltestComponent } from './modaltest.component';

describe('ModaltestComponent', () => {
  let component: ModaltestComponent;
  let fixture: ComponentFixture<ModaltestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModaltestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModaltestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

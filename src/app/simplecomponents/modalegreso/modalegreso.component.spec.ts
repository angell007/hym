import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalegresoComponent } from './modalegreso.component';

describe('ModalegresoComponent', () => {
  let component: ModalegresoComponent;
  let fixture: ComponentFixture<ModalegresoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalegresoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalegresoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

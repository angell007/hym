import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaldevoluccionComponent } from './modaldevoluccion.component';

describe('ModaldevoluccionComponent', () => {
  let component: ModaldevoluccionComponent;
  let fixture: ComponentFixture<ModaldevoluccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModaldevoluccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModaldevoluccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

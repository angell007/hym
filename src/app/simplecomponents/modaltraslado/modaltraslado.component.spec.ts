import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaltrasladoComponent } from './modaltraslado.component';

describe('ModaltrasladoComponent', () => {
  let component: ModaltrasladoComponent;
  let fixture: ComponentFixture<ModaltrasladoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModaltrasladoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModaltrasladoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

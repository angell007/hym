import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilcrearComponent } from './perfilcrear.component';

describe('PerfilcrearComponent', () => {
  let component: PerfilcrearComponent;
  let fixture: ComponentFixture<PerfilcrearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerfilcrearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilcrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

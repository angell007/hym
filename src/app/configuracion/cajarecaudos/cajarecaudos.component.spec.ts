import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CajarecaudosComponent } from './cajarecaudos.component';

describe('CajarecaudosComponent', () => {
  let component: CajarecaudosComponent;
  let fixture: ComponentFixture<CajarecaudosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CajarecaudosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CajarecaudosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

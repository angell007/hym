import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablacajarecaudosComponent } from './tablacajarecaudos.component';

describe('TablacajarecaudosComponent', () => {
  let component: TablacajarecaudosComponent;
  let fixture: ComponentFixture<TablacajarecaudosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablacajarecaudosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablacajarecaudosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

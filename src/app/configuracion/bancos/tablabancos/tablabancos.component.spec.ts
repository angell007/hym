import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablabancosComponent } from './tablabancos.component';

describe('TablabancosComponent', () => {
  let component: TablabancosComponent;
  let fixture: ComponentFixture<TablabancosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablabancosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablabancosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

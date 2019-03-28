import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablacajasComponent } from './tablacajas.component';

describe('TablacajasComponent', () => {
  let component: TablacajasComponent;
  let fixture: ComponentFixture<TablacajasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablacajasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablacajasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

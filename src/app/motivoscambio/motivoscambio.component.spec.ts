import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MotivoscambioComponent } from './motivoscambio.component';

describe('MotivoscambioComponent', () => {
  let component: MotivoscambioComponent;
  let fixture: ComponentFixture<MotivoscambioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MotivoscambioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MotivoscambioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

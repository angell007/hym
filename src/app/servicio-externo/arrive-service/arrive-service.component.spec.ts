import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArriveServiceComponent } from './arrive-service.component';

describe('ArriveServiceComponent', () => {
  let component: ArriveServiceComponent;
  let fixture: ComponentFixture<ArriveServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArriveServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArriveServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

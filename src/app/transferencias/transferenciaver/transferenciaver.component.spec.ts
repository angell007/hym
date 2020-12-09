import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferenciaverComponent } from './transferenciaver.component';

describe('TransferenciaverComponent', () => {
  let component: TransferenciaverComponent;
  let fixture: ComponentFixture<TransferenciaverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferenciaverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferenciaverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

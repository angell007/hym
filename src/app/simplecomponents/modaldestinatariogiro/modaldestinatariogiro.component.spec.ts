import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaldestinatariogiroComponent } from './modaldestinatariogiro.component';

describe('ModaldestinatariogiroComponent', () => {
  let component: ModaldestinatariogiroComponent;
  let fixture: ComponentFixture<ModaldestinatariogiroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModaldestinatariogiroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModaldestinatariogiroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

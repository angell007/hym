import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalremitentegiroComponent } from './modalremitentegiro.component';

describe('ModalremitentegiroComponent', () => {
  let component: ModalremitentegiroComponent;
  let fixture: ComponentFixture<ModalremitentegiroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalremitentegiroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalremitentegiroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

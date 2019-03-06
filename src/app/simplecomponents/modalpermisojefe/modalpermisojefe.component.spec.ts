import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalpermisojefeComponent } from './modalpermisojefe.component';

describe('ModalpermisojefeComponent', () => {
  let component: ModalpermisojefeComponent;
  let fixture: ComponentFixture<ModalpermisojefeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalpermisojefeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalpermisojefeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

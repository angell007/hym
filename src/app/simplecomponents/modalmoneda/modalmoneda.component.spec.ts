import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalmonedaComponent } from './modalmoneda.component';

describe('ModalmonedaComponent', () => {
  let component: ModalmonedaComponent;
  let fixture: ComponentFixture<ModalmonedaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalmonedaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalmonedaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

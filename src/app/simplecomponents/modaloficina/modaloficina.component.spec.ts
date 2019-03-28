import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaloficinaComponent } from './modaloficina.component';

describe('ModaloficinaComponent', () => {
  let component: ModaloficinaComponent;
  let fixture: ComponentFixture<ModaloficinaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModaloficinaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModaloficinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

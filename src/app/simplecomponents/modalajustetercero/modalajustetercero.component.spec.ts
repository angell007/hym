import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalajusteterceroComponent } from './modalajustetercero.component';

describe('ModalajusteterceroComponent', () => {
  let component: ModalajusteterceroComponent;
  let fixture: ComponentFixture<ModalajusteterceroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalajusteterceroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalajusteterceroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalcorresponsaldiarioComponent } from './modalcorresponsaldiario.component';

describe('ModalcorresponsaldiarioComponent', () => {
  let component: ModalcorresponsaldiarioComponent;
  let fixture: ComponentFixture<ModalcorresponsaldiarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalcorresponsaldiarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalcorresponsaldiarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

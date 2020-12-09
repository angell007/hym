import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreardestinatarioComponent } from './creardestinatario.component';

describe('CreardestinatarioComponent', () => {
  let component: CreardestinatarioComponent;
  let fixture: ComponentFixture<CreardestinatarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreardestinatarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreardestinatarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

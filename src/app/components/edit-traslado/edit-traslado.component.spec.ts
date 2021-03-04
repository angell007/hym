import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTrasladoComponent } from './edit-traslado.component';

describe('EditTrasladoComponent', () => {
  let component: EditTrasladoComponent;
  let fixture: ComponentFixture<EditTrasladoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTrasladoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTrasladoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

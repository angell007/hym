import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorresponsalbancarioComponent } from './corresponsalbancario.component';

describe('CorresponsalbancarioComponent', () => {
  let component: CorresponsalbancarioComponent;
  let fixture: ComponentFixture<CorresponsalbancarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorresponsalbancarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorresponsalbancarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorresponsalesbancariosComponent } from './corresponsalesbancarios.component';

describe('CorresponsalesbancariosComponent', () => {
  let component: CorresponsalesbancariosComponent;
  let fixture: ComponentFixture<CorresponsalesbancariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorresponsalesbancariosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorresponsalesbancariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

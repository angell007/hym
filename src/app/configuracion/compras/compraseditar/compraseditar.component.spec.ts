import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompraseditarComponent } from './compraseditar.component';

describe('CompraseditarComponent', () => {
  let component: CompraseditarComponent;
  let fixture: ComponentFixture<CompraseditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompraseditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompraseditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

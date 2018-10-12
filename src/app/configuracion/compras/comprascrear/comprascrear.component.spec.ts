import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprascrearComponent } from './comprascrear.component';

describe('ComprascrearComponent', () => {
  let component: ComprascrearComponent;
  let fixture: ComponentFixture<ComprascrearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComprascrearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComprascrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

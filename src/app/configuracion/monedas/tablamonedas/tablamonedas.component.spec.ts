import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablamonedasComponent } from './tablamonedas.component';

describe('TablamonedasComponent', () => {
  let component: TablamonedasComponent;
  let fixture: ComponentFixture<TablamonedasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablamonedasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablamonedasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

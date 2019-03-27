import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabladestinatariogiroComponent } from './tabladestinatariogiro.component';

describe('TabladestinatariogiroComponent', () => {
  let component: TabladestinatariogiroComponent;
  let fixture: ComponentFixture<TabladestinatariogiroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabladestinatariogiroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabladestinatariogiroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

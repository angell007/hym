import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabladestinatariosComponent } from './tabladestinatarios.component';

describe('TabladestinatariosComponent', () => {
  let component: TabladestinatariosComponent;
  let fixture: ComponentFixture<TabladestinatariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabladestinatariosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabladestinatariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

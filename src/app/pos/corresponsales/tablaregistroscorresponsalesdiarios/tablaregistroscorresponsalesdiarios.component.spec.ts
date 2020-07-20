import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaregistroscorresponsalesdiariosComponent } from './tablaregistroscorresponsalesdiarios.component';

describe('TablaregistroscorresponsalesdiariosComponent', () => {
  let component: TablaregistroscorresponsalesdiariosComponent;
  let fixture: ComponentFixture<TablaregistroscorresponsalesdiariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaregistroscorresponsalesdiariosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaregistroscorresponsalesdiariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

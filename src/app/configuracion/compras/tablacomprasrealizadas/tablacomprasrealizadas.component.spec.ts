import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablacomprasrealizadasComponent } from './tablacomprasrealizadas.component';

describe('TablacomprasrealizadasComponent', () => {
  let component: TablacomprasrealizadasComponent;
  let fixture: ComponentFixture<TablacomprasrealizadasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablacomprasrealizadasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablacomprasrealizadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

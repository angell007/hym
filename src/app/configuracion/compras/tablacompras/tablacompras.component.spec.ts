import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablacomprasComponent } from './tablacompras.component';

describe('TablacomprasComponent', () => {
  let component: TablacomprasComponent;
  let fixture: ComponentFixture<TablacomprasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablacomprasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablacomprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

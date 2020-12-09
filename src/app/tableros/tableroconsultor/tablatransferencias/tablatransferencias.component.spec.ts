import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablatransferenciasComponent } from './tablatransferencias.component';

describe('TablatransferenciasComponent', () => {
  let component: TablatransferenciasComponent;
  let fixture: ComponentFixture<TablatransferenciasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablatransferenciasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablatransferenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

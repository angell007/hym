import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablatransferenciasdevueltasComponent } from './tablatransferenciasdevueltas.component';

describe('TablatransferenciasdevueltasComponent', () => {
  let component: TablatransferenciasdevueltasComponent;
  let fixture: ComponentFixture<TablatransferenciasdevueltasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablatransferenciasdevueltasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablatransferenciasdevueltasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

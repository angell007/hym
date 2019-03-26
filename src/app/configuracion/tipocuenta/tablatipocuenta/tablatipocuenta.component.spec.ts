import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablatipocuentaComponent } from './tablatipocuenta.component';

describe('TablatipocuentaComponent', () => {
  let component: TablatipocuentaComponent;
  let fixture: ComponentFixture<TablatipocuentaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablatipocuentaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablatipocuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

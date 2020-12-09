import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablatipodocumentoComponent } from './tablatipodocumento.component';

describe('TablatipodocumentoComponent', () => {
  let component: TablatipodocumentoComponent;
  let fixture: ComponentFixture<TablatipodocumentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablatipodocumentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablatipodocumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

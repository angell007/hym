import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlujoefectivoComponent } from './flujoefectivo.component';

describe('FlujoefectivoComponent', () => {
  let component: FlujoefectivoComponent;
  let fixture: ComponentFixture<FlujoefectivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlujoefectivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlujoefectivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

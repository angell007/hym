import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaltipodocumentoComponent } from './modaltipodocumento.component';

describe('ModaltipodocumentoComponent', () => {
  let component: ModaltipodocumentoComponent;
  let fixture: ComponentFixture<ModaltipodocumentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModaltipodocumentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModaltipodocumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipodocumentoextranjeroComponent } from './tipodocumentoextranjero.component';

describe('TipodocumentoextranjeroComponent', () => {
  let component: TipodocumentoextranjeroComponent;
  let fixture: ComponentFixture<TipodocumentoextranjeroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipodocumentoextranjeroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipodocumentoextranjeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

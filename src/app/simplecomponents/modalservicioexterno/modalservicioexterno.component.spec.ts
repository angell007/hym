import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalservicioexternoComponent } from './modalservicioexterno.component';

describe('ModalservicioexternoComponent', () => {
  let component: ModalservicioexternoComponent;
  let fixture: ComponentFixture<ModalservicioexternoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalservicioexternoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalservicioexternoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

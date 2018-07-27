import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformaciongirosComponent } from './informaciongiros.component';

describe('InformaciongirosComponent', () => {
  let component: InformaciongirosComponent;
  let fixture: ComponentFixture<InformaciongirosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformaciongirosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformaciongirosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

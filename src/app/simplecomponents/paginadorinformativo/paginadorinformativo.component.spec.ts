import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginadorinformativoComponent } from './paginadorinformativo.component';

describe('PaginadorinformativoComponent', () => {
  let component: PaginadorinformativoComponent;
  let fixture: ComponentFixture<PaginadorinformativoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaginadorinformativoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginadorinformativoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

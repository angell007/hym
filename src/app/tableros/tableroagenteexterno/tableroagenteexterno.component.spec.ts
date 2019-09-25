import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableroagenteexternoComponent } from './tableroagenteexterno.component';

describe('TableroagenteexternoComponent', () => {
  let component: TableroagenteexternoComponent;
  let fixture: ComponentFixture<TableroagenteexternoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableroagenteexternoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableroagenteexternoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

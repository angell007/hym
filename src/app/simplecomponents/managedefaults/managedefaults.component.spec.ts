import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagedefaultsComponent } from './managedefaults.component';

describe('ManagedefaultsComponent', () => {
  let component: ManagedefaultsComponent;
  let fixture: ComponentFixture<ManagedefaultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagedefaultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagedefaultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

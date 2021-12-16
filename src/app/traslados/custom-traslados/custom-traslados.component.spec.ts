/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CustomTrasladosComponent } from './custom-traslados.component';

describe('CustomTrasladosComponent', () => {
  let component: CustomTrasladosComponent;
  let fixture: ComponentFixture<CustomTrasladosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomTrasladosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomTrasladosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

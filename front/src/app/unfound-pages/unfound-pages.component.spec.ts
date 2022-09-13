import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnfoundPagesComponent } from './unfound-pages.component';

describe('UnfoundPagesComponent', () => {
  let component: UnfoundPagesComponent;
  let fixture: ComponentFixture<UnfoundPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnfoundPagesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnfoundPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

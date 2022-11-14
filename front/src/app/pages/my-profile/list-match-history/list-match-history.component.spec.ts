import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMatchHistoryComponent } from './list-match-history.component';

describe('ListMatchHistoryComponent', () => {
  let component: ListMatchHistoryComponent;
  let fixture: ComponentFixture<ListMatchHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListMatchHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListMatchHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

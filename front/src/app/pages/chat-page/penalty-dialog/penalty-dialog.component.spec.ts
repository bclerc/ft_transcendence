import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PenaltyDialogComponent } from './penalty-dialog.component';

describe('PenaltyDialogComponent', () => {
  let component: PenaltyDialogComponent;
  let fixture: ComponentFixture<PenaltyDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PenaltyDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PenaltyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

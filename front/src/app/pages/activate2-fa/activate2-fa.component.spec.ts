import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Activate2FaComponent } from './activate2-fa.component';

describe('Activate2FaComponent', () => {
  let component: Activate2FaComponent;
  let fixture: ComponentFixture<Activate2FaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Activate2FaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Activate2FaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayRankedPongPagesComponent } from './play-ranked-pong-pages.component';

describe('PlayRankedPongPagesComponent', () => {
  let component: PlayRankedPongPagesComponent;
  let fixture: ComponentFixture<PlayRankedPongPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayRankedPongPagesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayRankedPongPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChristmasProductCardComponent } from './christmas-product-card.component';

describe('ChristmasProductCardComponent', () => {
  let component: ChristmasProductCardComponent;
  let fixture: ComponentFixture<ChristmasProductCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChristmasProductCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChristmasProductCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

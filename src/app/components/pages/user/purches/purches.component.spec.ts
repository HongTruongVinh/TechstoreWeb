import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchesComponent } from './purches.component';

describe('PurchesComponent', () => {
  let component: PurchesComponent;
  let fixture: ComponentFixture<PurchesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PurchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

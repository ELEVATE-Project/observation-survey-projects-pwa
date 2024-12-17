import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyJourneyOngoingCardComponent } from './my-journey-ongoing-card.component';

describe('MyJourneyOngoingCardComponent', () => {
  let component: MyJourneyOngoingCardComponent;
  let fixture: ComponentFixture<MyJourneyOngoingCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MyJourneyOngoingCardComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MyJourneyOngoingCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocationUpdatePage } from './location-update.page';

describe('LocationUpdatePage', () => {
    let component: LocationUpdatePage;
    let fixture: ComponentFixture<LocationUpdatePage>;

    beforeEach(() => {
        fixture = TestBed.createComponent(LocationUpdatePage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

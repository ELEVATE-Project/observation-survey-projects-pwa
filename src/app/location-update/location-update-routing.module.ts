import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocationUpdatePage } from './location-update.page';

const routes: Routes = [
    {
        path: '',
        component: LocationUpdatePage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LocationUpdatePageRoutingModule { }

import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'authentication_frontend_library';
const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'listing/:type',
    loadChildren: () => import('./listing/listing.module').then( m => m.ListingPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'project-details',
    loadChildren: () => import('./project/project.module').then( m => m.ProjectPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'profile-edit',
    loadChildren: () => import('./profile-edit/profile-edit.module').then( m => m.ProfileEditPageModule)
  },
  { path: '', loadChildren: () => import('authentication_frontend_library').then(m => m.SlRoutingRoutingModule) },
  {
    path: '**',
    redirectTo: 'home'
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

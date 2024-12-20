import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'authentication_frontend_library';
const routes: Routes = [
  /* Do not change mohini & create-project route objects, they're necessary to load Reflection and Project Creation react apps via nginx */
  { path: 'mohini',
    redirectTo: '', 
    pathMatch: 'prefix' 
  },
  { path: 'create-project', 
    redirectTo: '', 
    pathMatch: 'prefix'
   },
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'list',
    loadChildren: () => import('./generic-listing-page/generic-listing-page.module').then((m) => m.GenericListingPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'mi-details',
    loadChildren: () => import('./mi-details/mi-details.module').then( m => m.MiDetailsPageModule)
  },
  {
    path: 'project-details',
    loadChildren: () =>
      import('./project/project.module').then((m) => m.ProjectPageModule),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./profile/profile.module').then((m) => m.ProfilePageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'profile-edit',
    loadChildren: () =>
      import('./profile-edit/profile-edit.module').then(
        (m) => m.ProfileEditPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('authentication_frontend_library').then(
        (m) => m.SlRoutingRoutingModule
      ),
  },
  {
    path: 'reflection',
    loadChildren: () => import('./reflection/reflection.module').then( m => m.ProjectPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: 'intro',
  },
  {
    path: 'intro',
    loadChildren: () =>
      import('./intro/intro.module').then((m) => m.IntroPageModule),
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

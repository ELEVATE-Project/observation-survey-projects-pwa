import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'authentication_frontend_library';
import { RedirectionHandlerComponent } from './redirection-handler/redirection-handler.component';
const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then((m) => m.HomePageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'list/report',
    loadChildren: () =>
      import('./report-list/report-list.module').then(
        (m) => m.ReportListPageModule
      ),
  },
  {
    path: 'qr-scanner',
    loadChildren: () => import('./qr-scanner/qr-scanner.module').then( m => m.QrScannerPageModule)
  },
  {
    path: 'listing/:type',
    loadChildren: () => import('./listing/listing.module').then( m => m.ListingPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'project-details',
    loadChildren: () => import('./project/project.module').then( m => m.ProjectPageModule),
  },
  {
    path: 'project-report',
    loadChildren: () => import('./project-report/project-report.module').then( m => m.ProjectReportPageModule)
  },
  {
    path: 'view/:type/:id',
    component: RedirectionHandlerComponent,
  },
  {
    path: 'project-library',
    loadChildren: () => import('./project-library/project-library.module').then(m => m.ProjectLibraryModule)
  },
  {

    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'profile-edit',
    loadChildren: () => import('./profile-edit/profile-edit.module').then( m => m.ProfileEditPageModule),
    canActivate: [AuthGuard]
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

import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'authentication_frontend_library';
import { RedirectionHandlerComponent } from './redirection-handler/redirection-handler.component';
import { allowPageAccessGuard } from './services/guard/allowPageAccess/allow-page-access.guard';
import { PAGE_IDS } from './core/constants/pageIds';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then((m) => m.HomePageModule),
    canActivate: [AuthGuard, allowPageAccessGuard],
    data: { pageId: PAGE_IDS.home }
  },
  {
    path: 'report/list',
    loadChildren: () =>
      import('./report-list/report-list.module').then(
        (m) => m.ReportListPageModule
      ),
    canActivate: [allowPageAccessGuard],
    data: { pageId: PAGE_IDS.reportsList }
  },
  {
    path:'report-details/:id',
    loadChildren:() => import('./generic-report/generic-report.module').then(m => m.GenericReportModule),
    canActivate: [allowPageAccessGuard],
    data: { pageId: PAGE_IDS.reportDetails }
  },
  {
    path:'questionnaire/:id',
    loadChildren:() => import('./questionnaire/questionnaire.module').then(m => m.QuestionnaireModule),
    canActivate: [allowPageAccessGuard],
    data: { pageId: PAGE_IDS.questioniare }
  },
  {
    path:'observation',
    loadChildren:() => import('./observation/observation.module').then(m => m.ObservationModule)
  },
  {
    path: 'qr-scanner',
    loadChildren: () => import('./qr-scanner/qr-scanner.module').then( m => m.QrScannerPageModule),
    canActivate: [allowPageAccessGuard],
    data: { pageId: PAGE_IDS.qrScanner }
  },
  {
    path: 'project-downloads',
    loadChildren: () => import('./download-list/download-list.module').then( m => m.DownloadListPageModule),
    canActivate:[allowPageAccessGuard],
    data: { pageId: PAGE_IDS.downloads }
  },
  {
    path: 'program-details/:id',
    loadChildren: () => import('./program-details/program-details.module').then( m => m.ProgramDetailsPageModule),
    canActivate:[allowPageAccessGuard],
    data: { pageId: PAGE_IDS.programDetails }
  },
  {
    path: 'listing/:type',
    loadChildren: () => import('./listing/listing.module').then( m => m.ListingPageModule),
    canActivate: [AuthGuard, allowPageAccessGuard],
    data: { pageId: PAGE_IDS.listing }
  },
  {
    path: 'project-details',
    loadChildren: () => import('./project/project.module').then( m => m.ProjectPageModule),
    canActivate:[allowPageAccessGuard],
    data: { pageId: PAGE_IDS.projectDetails }
  },
  {
    path: 'project-report',
    loadChildren: () => import('./project-report/project-report.module').then( m => m.ProjectReportPageModule),
    canActivate:[allowPageAccessGuard],
    data: { pageId: PAGE_IDS.projectReport }
  },
  {
    path: 'view/:type/:id',
    component: RedirectionHandlerComponent,
    canActivate:[allowPageAccessGuard],
    data: { pageId: PAGE_IDS.deeplinkRedirect }
  },
  {
    path: 'project-library',
    loadChildren: () => import('./project-library/project-library.module').then(m => m.ProjectLibraryModule),
    canActivate:[allowPageAccessGuard],
    data: { pageId: PAGE_IDS.library }
  },
  {

    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule),
    canActivate: [AuthGuard, allowPageAccessGuard],
    data: { pageId: PAGE_IDS.profile }
  },
  {
    path: 'profile-edit',
    loadChildren: () => import('./profile-edit/profile-edit.module').then( m => m.ProfileEditPageModule),
    canActivate: [AuthGuard, allowPageAccessGuard],
    data: { pageId: PAGE_IDS.editProfile }
  },
  { path: '',
    // pathMatch: "prefix",
    loadChildren: () => import('authentication_frontend_library').then(m => m.SlRoutingRoutingModule),
    canActivate:[allowPageAccessGuard],
    data: { pageId: PAGE_IDS.authPages }
  },
  {
    path: '**',
    // redirectTo: 'home',
    component: PageNotFoundComponent
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

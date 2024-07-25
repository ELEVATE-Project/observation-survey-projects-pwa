import { Component, OnInit, AfterViewInit, ViewChild, inject } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LoaderService } from '../services/loader/loader.service';
import { ApiBaseService } from '../services/base-api/api-base.service';
import urlConfig from 'src/app/config/url.config.json';
import { UrlConfig } from '../interfaces/main.interface';
import { finalize } from 'rxjs';
import { ToastService } from '../services/toast/toast.service';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-project-report',
  templateUrl: './project-report.page.html',
  styleUrls: ['./project-report.page.scss'],
})
export class ProjectReportPage implements OnInit {
  isFilter: boolean = false;
  loader: LoaderService;
  baseApiService: any;
  listType!: keyof UrlConfig;
  toastService: ToastService;
  reportData: any;
  reportType: string = "1";
  programId: string = "";
  isModalOpen = false;
  selectedProgram: string = "";
  programList: any;
  projectsCategories:any;
   backgroundColors = [
    'rgb(255, 99, 132)',
    'rgb(54, 162, 235)',
    'rgb(255, 205, 86)',
    'rgb(255, 159, 64)',
    'rgb(75, 192, 192)',
    'rgb(255, 99, 132)',
    'rgb(54, 162, 235)',
    'rgb(255, 205, 86)',
  ]

  constructor(
    private navCtrl: NavController,
    private router: ActivatedRoute
  ) {
    this.loader = inject(LoaderService);
    this.baseApiService = inject(ApiBaseService);
    this.toastService = inject(ToastService);
    Chart.register(...registerables);
    Chart.register(ChartDataLabels);
  }

  ngOnInit() {
    this.listType = 'report';
    this.getReportData(this.reportType);
     this.projectsCategories = [
      {
        name: 'Total Projects',
        img: '/assets/images/report-imgs/Note 1.svg',
        key: 'total',
      },
      {
        name: 'Projects Submitted',
        img: '/assets/images/report-imgs/note.svg',
        key: 'submitted',
      },
      {
        name: 'Projects In Progress',
        img: '/assets/images/report-imgs/Note 4.svg',
        key: 'inProgress',
      },
      {
        name: 'Projects Started',
        img: '/assets/images/report-imgs/Note 3.svg',
        key: 'started',
      },
    ];
    // this.getPrograms();
    setTimeout(() => {
      this.renderChart(this.reportData?.tasks, this.reportData?.categories);
    });
  }

  goBack() {
    this.navCtrl.back();
  }

  getReportType(e: any) {
    this.reportType = e;
    this.getReportData(this.reportType);
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  async getReportData(reportType: string) {
    await this.loader.showLoading('Please wait while loading...');
      this.baseApiService.get(urlConfig[this.listType].listingUrl + `?reportType=${reportType}`)
        .pipe(finalize(async () => {
          await this.loader.dismissLoading();
        }))
        .subscribe((res: any) => {
          if (res?.status === 200) {
            if (res.result.dataAvailable) {
              this.reportData = res.result.data;
              this.renderChart(this.reportData.tasks, this.reportData.categories); // Update charts after data fetch
            } else {
              this.setOpen(true);
            }
          }
        }, (err: any) => {
          this.toastService.presentToast(err?.error?.message,'danger');
        });

  }

  // async getPrograms() {
  //   this.baseApiService.get(urlConfig["program"].listingUrl + `?pageNo=1&pageSize=1`)
  //     .pipe(finalize(async () => { }))
  //     .subscribe((res: any) => {
  //       if (res?.status === 200) {
  //         this.programList = res.result.data;
  //       }
  //     })
  // }

  share() {
    console.log('this is share');
  }

  getAction(event: any) {
    switch (event) {
      case 'download':
        this.download();
        break;
      case 'share':
        this.share();
        break;
    }
  }

  async download() {
    await this.loader.showLoading('Please wait while downloading...');
    this.baseApiService.get(urlConfig[this.listType].listingUrl + `?requestPdf=true&reportType=${this.reportType}&programId=${this.programId}`)
      .pipe(finalize(async () => {
        await this.loader.dismissLoading();
      }))
      .subscribe((res: any) => {
        if (res?.status === 200) {
          if (res.result.data) {
            const today = new Date();
            const day = String(today.getDate()).padStart(2, '0');
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const year = today.getFullYear();
            const formattedDate = `${day}-${month}-${year}`;
            const name = `project-report_${formattedDate}`;
            this.downloadFile(res.result.data.downloadUrl, name);
          }
          else{
            this.toastService.presentToast("Downloading failed !!", 'danger');
          }
        }
      })
  }

  renderChart(taskData: any, categoryData: any): void {
    const capitalizeAndSpaceKeys = (obj:any) => {
      return Object.keys(obj).reduce((acc:any, key) => {
        const spacedKey = key.replace(/([a-z])([A-Z])/g, '$1 $2');
        const capitalizedKey = spacedKey.charAt(0).toUpperCase() + spacedKey.slice(1);
        acc[capitalizedKey] = obj[key];
        return acc;
      }, {});
    };

    const { total: taskTotal, ...filteredTaskData } = taskData || {};
    const { total: categoryTotal, ...filteredCategoryData } = categoryData || {};

    const capitalizedTaskData = capitalizeAndSpaceKeys(filteredTaskData);
    const capitalizedCategoryData = capitalizeAndSpaceKeys(filteredCategoryData);


    const dataForTask = {
      labels: Object.keys(capitalizedTaskData),
      datasets: [{
        data: Object.values(capitalizedTaskData),
        backgroundColor: this.backgroundColors,
        hoverOffset: 4
      }]
    };

    const dataForCategory = {
      labels: Object.keys(capitalizedCategoryData),
      datasets: [{
        data: Object.values(capitalizedCategoryData),
        backgroundColor: this.backgroundColors,
        hoverOffset: 4
      }]
    };

    const taskCanvas = document.getElementById('doughnutChart') as HTMLCanvasElement;
    const Categoriescanvas = document.getElementById('doughnutChartforcategory') as HTMLCanvasElement;
    if (taskCanvas) {
      const existingChart = Chart.getChart(taskCanvas);
      if (existingChart) {
        existingChart.destroy();
      }
      const ctx = taskCanvas.getContext('2d');
      if (ctx) {
        new Chart(ctx, {
          type: 'doughnut',
          data: dataForTask,
          options: {
            plugins: {
              legend: {
                position: 'bottom',
              },
              datalabels: {
                formatter: (value, context) => {
                  const total = context.dataset.data.reduce((acc: any, cur: any) => acc + cur, 0);
                  const percentage = (value / total * 100).toFixed(1) + '%';
                  return percentage;
                },
                color: '#fff',
                anchor: 'end',
                align: 'start'
              }
            }
          },
          plugins: [ChartDataLabels]
        });
      }
    } else {
      console.error('Canvas element not found');
    }

    if (Categoriescanvas) {
      const existingChart2 = Chart.getChart(Categoriescanvas);
      if(        existingChart2) {
        existingChart2.destroy();
      }
      const ctx2 = Categoriescanvas.getContext('2d');
      if (ctx2) {
        new Chart(ctx2, {
          type: 'doughnut',
          data: dataForCategory,
          options: {
            plugins: {
              legend: {
                position: 'bottom',
              },
              datalabels: {
                formatter: (value, context) => {
                  const total = context.dataset.data.reduce((acc: any, cur: any) => acc + cur, 0);
                  const percentage = (value / total * 100).toFixed(1) + '%';
                  return percentage;
                },
                color: '#fff',
                anchor: 'end',
                align: 'start'
              }
            }
          },
          plugins: [ChartDataLabels]
        });
      }
    } else {
      console.error('Canvas element not found');
    }
  }

  getprogram(event: any) {
    this.programId = event.detail.value;
    this.getReportData(this.reportType);
  }

  downloadFile(url: any, name: string) {
    let fileName = name.length > 40 ? name.slice(0, 40) + '...' : name;
    fetch(url).then(resp => resp.blob()).then(blob => {
      const convertedUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = convertedUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(convertedUrl);
    });
  }
}
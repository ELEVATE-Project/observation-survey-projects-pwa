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
  projectsArr:any;


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
     this.projectsArr = [
      {
        name: 'Total Projects',
        img: '/assets/images/report-imgs/Note 1.svg',
        key: 'total',
      },
      {
        name: 'Projects submitted',
        img: '/assets/images/report-imgs/note.svg',
        key: 'submitted',
      },
      {
        name: 'Projects inProgress',
        img: '/assets/images/report-imgs/Note 4.svg',
        key: 'inProgress',
      },
      {
        name: 'Projects started',
        img: '/assets/images/report-imgs/Note 3.svg',
        key: 'started',
      },
    ];
    this.getPrograms();
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
    if (!this.programId) {
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
              this.toastService.presentToast('No data available');
            }
          }
        }, (err: any) => {
          this.toastService.presentToast(err?.error?.message);
        });
    } else {
      this.baseApiService.get(urlConfig[this.listType].listingUrl + `?reportType=${reportType}&programId=${this.programId}`)
        .pipe(finalize(async () => {
          await this.loader.dismissLoading();
        }))
        .subscribe((res: any) => {
          if (res?.status === 200) {
            if (res.result.dataAvailable) {
              this.reportData = res.result.data;
              this.renderChart(this.reportData.tasks, this.reportData.categories);
            } else {
              this.selectedProgram = "";
              this.programId = "";
              this.setOpen(true);
            }
          }
        })
    }
  }

  async getPrograms() {
    this.baseApiService.get(urlConfig["program"].listingUrl + `?pageNo=1&pageSize=1`)
      .pipe(finalize(async () => { }))
      .subscribe((res: any) => {
        if (res?.status === 200) {
          this.programList = res.result.data;
          console.log(this.programList);
        }
      })
  }

  share() {
    console.log('this is share');
  }

  getAction(event: any) {
    switch (event) {
      case 'Download':
        this.download();
        break;
      case 'Share':
        this.share();
        break;
    }
  }

  async download() {
    await this.loader.showLoading('Please wait while loading...');
    this.baseApiService.get(urlConfig[this.listType].listingUrl + `?requestPdf=true&reportType=${this.reportType}&programId=${this.programId}`)
      .pipe(finalize(async () => {
        await this.loader.dismissLoading();
      }))
      .subscribe((res: any) => {
        if (res?.status === 200) {
          this.downloadFile(res.result.data.downloadUrl, "data");
          console.log(res.result.data);
        }
      })
  }

  renderChart(taskData: any, categoryData: any): void {

  const { total: taskTotal, ...filteredTaskData } = taskData || {};

  const { total: categoryTotal, ...filteredCategoryData } = categoryData || {};

    const data = {
      labels: Object.keys(filteredTaskData),
      datasets: [{
        data: Object.values(filteredTaskData),
        backgroundColor: [
          'rgb(255, 99, 132)',  // Red
          'rgb(54, 162, 235)',  // Blue
          'rgb(255, 205, 86)',  // Yellow
          'rgb(255, 159, 64)',  // Orange
          'rgb(75, 192, 192)',  // Green
          'rgb(255, 99, 132)',  // Red
          'rgb(54, 162, 235)',  // Blue
          'rgb(255, 205, 86)',  // Yellow
        ],
        hoverOffset: 4
      }]
    };

    const data2 = {
      labels: Object.keys(filteredCategoryData),
      datasets: [{
        data: Object.values(filteredCategoryData),
        backgroundColor: [
          'rgb(255, 99, 132)',  // Red
          'rgb(54, 162, 235)',  // Blue
          'rgb(255, 205, 86)',  // Yellow
          'rgb(255, 159, 64)',  // Orange
          'rgb(75, 192, 192)',  // Green
          'rgb(255, 99, 132)',  // Red
          'rgb(54, 162, 235)',  // Blue
          'rgb(255, 205, 86)',  // Yellow
        ],
        hoverOffset: 4
      }]
    };

    const canvas = document.getElementById('doughnutChart') as HTMLCanvasElement;
    const canvas2 = document.getElementById('doughnutChartforcategory') as HTMLCanvasElement;
    if (canvas) {
      const existingChart = Chart.getChart(canvas);
      if (existingChart) {
        existingChart.destroy();
      }
      const ctx = canvas.getContext('2d');
      if (ctx) {
        new Chart(ctx, {
          type: 'doughnut',
          data: data,
          options: {
            plugins: {
              legend: {
                position: 'bottom', // Position legend at the bottom
              },
              datalabels: {
                formatter: (value, context) => {
                  const total = context.dataset.data.reduce((acc: any, cur: any) => acc + cur, 0);
                  const percentage = (value / total * 100).toFixed(1) + '%';
                  return percentage;
                },
                color: '#fff', // Data label color
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

    if (canvas2) {
      const existingChart2 = Chart.getChart(canvas2);
      if(        existingChart2) {
        existingChart2.destroy();
      }
      const ctx2 = canvas2.getContext('2d');
      if (ctx2) {
        new Chart(ctx2, {
          type: 'doughnut',
          data: data2,
          options: {
            plugins: {
              legend: {
                position: 'bottom', // Position legend at the bottom
              },
              datalabels: {
                formatter: (value, context) => {
                  const total = context.dataset.data.reduce((acc: any, cur: any) => acc + cur, 0);
                  const percentage = (value / total * 100).toFixed(1) + '%';
                  return percentage;
                },
                color: '#fff', // Data label color
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
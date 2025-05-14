import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BaseChartDirective} from 'ng2-charts';
import {ProgressBarModule} from 'primeng/progressbar';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Chart, ChartData, ChartOptions, registerables} from 'chart.js';

import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {BrowserModule} from '@angular/platform-browser';
import {ChartModule} from 'primeng/chart';
import {CardModule} from 'primeng/card';
import {DatePickerModule} from 'primeng/datepicker';

import {TableModule} from 'primeng/table';
import {SelectModule} from 'primeng/select';


Chart.register(...registerables);
@Component({
  selector: 'app-user-evaluation',
  imports: [BaseChartDirective,SelectModule,
    ProgressBarModule,CommonModule,FormsModule, ChartModule, CardModule, DatePickerModule, TableModule],
  templateUrl: './user-evaluation.component.html',
  styleUrl: './user-evaluation.component.css',
  providers: [DialogService],
})
export class UserEvaluationComponent implements AfterViewInit{
  @ViewChild('doughnutCanvas') doughnutCanvas!: ElementRef;

  ref: DynamicDialogRef | undefined;

  count=[
    'Todos','A','B'
  ]

  evaluaciones = [
    {
      fecha: '15/01/2025',
      destinatario: 'Yanacocha',
      tipoDestinatario: 'Internet',
      estado: 'Aprobado',
      puntaje: '90% - Muy satisfactorio'
    },
    {
      fecha: '11/01/2025',
      destinatario: 'CargoPerú',
      tipoDestinatario: 'Telefonia',
      estado: 'Pendiente',
      puntaje: '-'
    }
  ];

  public chartItems = [
    { label: 'Negativo', color: '#FF9A57', value: 2 },
    { label: 'Positivo', color: '#6BE39C', value: 9 },
  ];
  total = this.chartItems.reduce((sum, item) => sum + item.value, 0);

  public doughnutChartData: ChartData<'doughnut'> = {

    labels: this.chartItems.map(item => item.label),

    datasets: [
      {
        data: this.chartItems.map(item => parseFloat(((item.value / this.total) * 100).toFixed(2))),
        backgroundColor: this.chartItems.map(item => item.color),
        hoverBackgroundColor: ['#4CAF50', '#E65100', '#2E7D32', '#F9A825', '#7CB342', '#00897B']
      }
    ]
  };

  public doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    cutout: '65%',
    plugins: {
      legend: { display: false }

    }
  };

  getPercentage(value: number): string {
    const total = this.chartItems.reduce((sum, item) => sum + item.value, 0);
    return ((value / total) * 100).toFixed(2);
  }


  public centerTextPlugin = {
    id: 'centerText',
    beforeDraw: (chart: Chart) => {

      if (chart.canvas.id !== 'doughnutChart') return;

      const { ctx, width, height } = chart;
      const total = this.chartItems.reduce((sum, item) => sum + item.value, 0);


      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // label total
      ctx.font = 'bold 16px Arial';
      ctx.fillStyle = '#666';
      ctx.fillText('Total', width / 2, height / 2 - 10);

      // number total
      ctx.font = 'bold 20px Arial';
      ctx.fillStyle = '#000';
      ctx.fillText(`${total}`, width / 2, height / 2 + 15);
      ctx.restore();
    },
    afterDatasetDraw: (chart: Chart) => {
      const { ctx } = chart;
      const meta = chart.getDatasetMeta(0);

      meta.data.forEach((element, index) => {
        const { x, y, outerRadius, innerRadius, startAngle, endAngle } = element.getProps(
          ['x', 'y', 'outerRadius', 'innerRadius', 'startAngle', 'endAngle'],
          true
        );

        const midAngle = (startAngle + endAngle) / 2;
        const radius = (outerRadius + innerRadius) / 2;


        const posX = x + radius * Math.cos(midAngle);
        const posY = y + radius * Math.sin(midAngle);

        const value = chart.data.datasets[0].data[index];

        const total = chart.data.datasets[0].data
          .map(value => (typeof value === 'number' ? value : 0))
          .reduce((sum, num) => sum + num, 0);

        ctx.save();
        ctx.font = 'bold 14px Arial';
        ctx.fillStyle = '#FFF';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        if(value!=null){
          const percentage = ((+value / total) * 100).toFixed(1) + '%';
          ctx.fillText(percentage, posX, posY);}
        ctx.restore();
      });
    }
  };

  public barChartData: any;
  public barChartOptions: any;

  rangeDates: Date[] | undefined;
  countSelected: any;



  constructor(private dialogService: DialogService ) {
    this.loadChartData();
    // Chart.register(this.centerTextPlugin);

  }

  ngAfterViewInit() {
    const canvas = this.doughnutCanvas.nativeElement as HTMLCanvasElement;
    canvas.id = 'doughnutChart';
    Chart.register(this.centerTextPlugin);
  }


  loadChartData() {
    this.barChartData = {
      labels: ['Enojado', 'Insatisfecho', 'Satisfecho', 'Completamente satisfecho'],
      datasets: [
        {
          label: 'Porcentaje %',
          data: [15, 35, 65, 40], // Valores en porcentaje
          backgroundColor: ['#E57373', '#FBC02D', '#AED581', '#66BB6A'],
          borderRadius: 40
        }
      ]
    };

    this.barChartOptions = {
      responsive: true,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          title: {
            display: true,
            text: 'Porcentaje %',
            font: {
              size: 14,
              weight: 'bold'
            },
            color: '#1F3C88'
          },
          min: 0,
          max: 100,
          ticks: {
            stepSize: 20
          },
          grid: {
            display: false
          }
        },
        x: {
          ticks: {
            autoSkip: false
          },
          grid: {
            display: false
          }
        }
      }
    };
  }

  return() {

  }

  openModal() {
    // this.ref = this.dialogService.open(RespondSurveyComponent, {
    //   header: 'Nueva Malla',
    //   width: '800px',
    //   dismissableMask: true,
    // });
    //
    // this.ref.onClose.subscribe((result) => {
    //   // this.router.navigate(['/management/new-mesh']);
    //   if (result) {
    //     console.log('Configuración guardada:', result);
    //
    //   }
    // });

  }
}

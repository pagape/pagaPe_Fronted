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
import {ConversationService} from "../../../services/conversation/conversation.service";
import {MessageService} from "primeng/api";


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

  negativeValue:number=0;
  positiveValue:number=0;
  public chartItems: { label: string; color: string; value: number }[] = [];

  public total: number = 0;

  public doughnutChartData!: ChartData<'doughnut'>;


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
      //const total = this.chartItems.reduce((sum, item) => sum + item.value, 0);
const total= this.total

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


  public barChartData!: any;
  public barChartOptions!: any;
  public emotionLabels: string[] = [];
  public emotionData: number[] = [];


  rangeDates: Date[] | undefined;
  countSelected: any;



  constructor(private dialogService: DialogService, public conversationService:ConversationService, public  messageService:MessageService) {
    this.loadSentimentMetrics();
    this.loadStatusMetrics();
    this.loadData();
    // Chart.register(this.centerTextPlugin);

  }

  ngAfterViewInit() {
    const canvas = this.doughnutCanvas.nativeElement as HTMLCanvasElement;
    canvas.id = 'doughnutChart';
    Chart.register(this.centerTextPlugin);
    console.log(this.rangeDates);
  }




  loadData() {
    this.conversationService.getAllConversations().subscribe({
      next: (response) => {
        console.log('Respuesta cruda:', response);

        this.evaluaciones = response;

        console.log('Datos normalizados:', this.evaluaciones);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las conversaciones'
        });
      }
    });

  }

  onDateRangeSelected() {
    if (this.rangeDates && this.rangeDates.length === 2) {
      const start = this.formatDate(this.rangeDates[0]);
      const end = this.formatDate(this.rangeDates[1]);

      console.log("Start date:", start);
      console.log("End date:", end);

      this.loadSentimentMetrics(start, end);
      this.loadStatusMetrics(start,end)
    } else {
      console.log("No se seleccionó rango de fechas todavía");
      this.loadSentimentMetrics();
      this.loadStatusMetrics();
    }
  }

  private formatDate(date: Date): string {
    return date.toISOString();
  }

  loadSentimentMetrics(starDate?:string, endDate?:string) {
    this.conversationService.getSentimentMetrics(starDate,endDate).subscribe({
      next: (response) => {
        console.log('Respuesta cruda:', response);

        // Armar labels y data desde el backend
        this.emotionLabels = Object.keys(response.distribution);
        this.emotionData = this.emotionLabels.map(
          label => response.percentages[label] ?? 0
        );

        this.barChartData = {
          labels: this.emotionLabels,
          datasets: [
            {
              label: 'Porcentaje %',
              data: this.emotionData,
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

        console.log('Bar Chart Data:', this.barChartData);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las métricas de emociones.'
        });
      }
    });
  }

  loadStatusMetrics(starDate?:string, endDate?:string) {
    this.conversationService.getStatusMetrics(starDate,endDate).subscribe({
      next: (response) => {
        console.log('Respuesta cruda:', response);

        this.positiveValue = response.distribution?.POSITIVO ?? 0;
        this.negativeValue = response.distribution?.NEGATIVO ?? 0;

        this.chartItems = [
          { label: 'Negativo', color: '#FF9A57', value: this.negativeValue },
          { label: 'Positivo', color: '#6BE39C', value: this.positiveValue },
        ];

       // this.total = this.chartItems.reduce((sum, item) => sum + item.value, 0);
       this.total= response.totalConversations
        this.doughnutChartData = {
          labels: this.chartItems.map(item => item.label),
          datasets: [
            {
              data: this.chartItems.map(item => {
                return this.total > 0
                  ? parseFloat(((item.value / this.total) * 100).toFixed(2))
                  : 0;
              }),
              backgroundColor: this.chartItems.map(item => item.color),
              hoverBackgroundColor: ['#4CAF50', '#E65100', '#2E7D32', '#F9A825', '#7CB342', '#00897B']
            }
          ]
        };

        console.log('Datos normalizados:', this.chartItems);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las conversaciones'
        });
      }
    });
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

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import {TooltipPosition, MatTooltipModule} from '@angular/material/tooltip';
import { NGX_ECHARTS_CONFIG, NgxEchartsModule } from 'ngx-echarts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    NgxEchartsModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule
  ],
  providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useFactory: () => ({ echarts: () => import('echarts') }),
    },
  ],
})
export class AppComponent implements OnInit {
  result: number | null = null;
  form!: FormGroup;
  chartOptions: any;
  constructor(private fb: FormBuilder) {}
  ngOnInit(): void {
    this.form = this.fb.group({
      dataEntries: this.fb.array([]),
    });
    this.addEntry();
  }
  get dataEntries() {
    return this.form.get('dataEntries') as FormArray;
  }

  createEntry(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      value: [null, [Validators.required, Validators.min(1)]],
    });
  }

  addEntry() {
    this.dataEntries.push(this.createEntry());
  }

  removeEntry(index: number) {
    this.dataEntries.removeAt(index);
  }

  generateChart() {
    if (this.form.invalid) {
      alert('Please correct the form before generating the chart.');
      return;
    }
    const chartData = this.dataEntries.value.map((entry: any) => ({
      name: entry.name,
      value: entry.value,
    }));

    this.chartOptions = {
      title: {
        text: 'Pie Chart',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: 'Data',
          type: 'pie',
          radius: '50%',
          data: chartData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };
  }
}

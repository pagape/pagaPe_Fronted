import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {SelectModule} from "primeng/select";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {DatePicker} from "primeng/datepicker";
import {config} from "rxjs";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";

@Component({
  selector: 'app-shared-form',
  imports: [FormsModule,DatePicker,CommonModule, SelectModule, InputTextModule,ButtonModule],
  templateUrl: './shared-form.component.html',
  styleUrl: './shared-form.component.css'
})
export class SharedFormComponent {

  @Input() title: string = '';
  @Input() fields: { label: string; name: string; type: string; required: boolean; placeholder?: any; options?: any, disable? :boolean, selectionMode? : undefined }[] = [];
  @Input() submitLabel: string = 'Guardar';

  @Output() closeModal = new EventEmitter<void>();
  @Output() submitForm = new EventEmitter<any>();

  @Input()formData? : any = {}; // Datos del formulario

  constructor(public  config:DynamicDialogConfig,public ref: DynamicDialogRef) {
  }

  ngOnInit() {
    if (this.config?.data?.initialValues) {
      this.formData = {...this.config.data.initialValues};
    }
  }
  onSubmit(form: any) {
    if (form.valid) {
      console.log(this.formData);
      this.submitForm.emit(this.formData);
      this.ref.close(this.formData);
    }
  }

  close() {
    this.ref.close();
  }

  check(name:string):boolean{

    return !!(this.config.data.tittle.includes('Editar') && name == 'userPassword');

  }


}

import { Component } from '@angular/core';

import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-confirm-modal',
  imports: [],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss'
})
export class ConfirmModalComponent {
  public message: string| undefined ='¿Está seguro de realizar esta operación?';
  public tableName:string | undefined;


  public details:any;

  constructor(
    private ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    this.init();
  }

  accept() {
    this.ref.close(true);
  }

  cancel() {
    this.ref.close(false);
  }

  private init(){

  }



}

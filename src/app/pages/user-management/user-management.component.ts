import { Component } from '@angular/core';
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {ClientModalComponent} from "../operation/modals/client-modal/client-modal.component";
import {ConfirmModalComponent} from "../../components/modals/confirm-modal/confirm-modal.component";
import {UserService} from "../../services/user/user.service";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {TableComponent} from "../../components/table/table.component";
import {ButtonModule} from "primeng/button";
import {SharedFormComponent} from "../../components/modals/shared-form/shared-form.component";
import {AuthService} from "../../services/auth.service";
import {NotificationService} from "../../services/notification.service";
import {UserInfo} from "../../models/user/user";

@Component({
  selector: 'app-user-management',
  imports: [CommonModule,FormsModule,TableComponent,ButtonModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css',
  providers:[DialogService]
})
export class UserManagementComponent {

  searchText: string = '';
  // Variable configurada como false y comentada para indicar que la funcionalidad está desactivada visualmente
  showInactiveUsers: boolean = false; // Funcionalidad de mostrar usuarios inactivos desactivada visualmente

  fields:any[]= [
    {label: 'Nombre', name: 'userFirstName', type: 'text', required: true, placeholder: 'Ingrese el nombre'},
    {
      label: 'Apellido',
      name: 'userLastName',
      type: 'text',
      required: true,
      placeholder: 'Ingrese la contraseña'
    },
    {label: 'DNI', name: 'userDNI', type: 'number', required: true, placeholder: 'Ingrese el DNI'},

    {
      label: 'Correo Electrónico',
      name: 'userEmail',
      type: 'email',
      required: true,
      placeholder: 'Ingrese el correo'
    },
    {
      label: 'Celular',
      name: 'userPhone',
      type: 'number',
      required: true,
      placeholder: 'Ingrese el número'
    },
    {
      label: 'Contraseña',
      name: 'userPassword',
      type: 'password',
      required: true,
      placeholder: 'Ingrese la contraseña'
    },
    {
      label: 'Rol en el Sistema', name: 'role', type: 'select', required: true,
      options: [
        {id: 'ADMIN', name: 'Administrador'},
        {id: 'WORKER', name: 'Trabajador'},
      ]
    }
  ];

  actions = [
    { icon: 'edit_square', action: (row: any) => this.onEdit(row)},
    { icon: 'delete_forever', action: (row: any) => this.onDelete(row)}
  ];
  
  columns = [
    { field: 'id', header: 'Id' },
    { field: 'userFirstName', header: 'Nombre' },
    { field: 'userLastName', header: 'Apellido' },
    { field: 'userDNI', header: 'DNI' },
    { field: 'userEmail', header: 'Correo' },
    { field: 'userPhone', header: 'Numero' },
    { field: 'role', header: 'Rol' },
    {
      field: 'actions',
      header: 'Opciones',
      type: 'actions',
      actions: this.actions,
    },
  ];

  data: UserInfo[] = []; // Datos paginados que se muestran en la tabla
  originalData: UserInfo[] = []; // Todos los datos originales
  filteredData: UserInfo[] = []; // Datos después de aplicar filtros
  ref: DynamicDialogRef | undefined;

  constructor(
    public dialogService: DialogService, 
    private userService: UserService, 
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    this.loadUsers();
  }

  onEdit(row: any) {const summitData = {
    tittle: 'Editar usuario',
    fields: this.fields,
    initialValues: {
      userFirstName: row.userFirstName,
      userLastName: row.userLastName,
      userDNI: row.userDNI,
      userEmail: row.userEmail,
      userPhone:row.userPhone,
      userPassword: row.userPassword,  // o no enviar contraseña si no se quiere editar
      role: row.role
    }
  };

    const ref = this.dialogService.open(SharedFormComponent, {
      data: summitData,
      dismissableMask: true,
    });

    ref.onClose.subscribe(result => {
      if (result) {
        console.log('Usuario editado:', result);
        this.handleUserSet(row.id,result);
      } else {
        console.log('modal cerrado');
      }
    });
  }

  loadUsers(){
    // La funcionalidad de cargar usuarios inactivos está desactivada visualmente, pero se mantiene la lógica
    if (this.showInactiveUsers) {
      this.userService.getAllUsersIncludingInactive().subscribe({
        next: (data: UserInfo[]) => {
          this.originalData = data;
          this.filteredData = [...data];
          this.applyPagination(0, 5);
          console.log('Todos los usuarios cargados (incluidos inactivos):', this.data);
        },
        error: (err: any) => {
          console.error('Error al cargar los usuarios:', err);
          this.notificationService.error('Error al cargar los usuarios');
        }
      });
    } else {
      this.userService.getAllUsers().subscribe({
        next: (data: UserInfo[]) => {
          this.originalData = data;
          this.filteredData = [...data];
          this.applyPagination(0, 5);
          console.log('Usuarios activos cargados:', this.data);
        },
        error: (err: any) => {
          console.error('Error al cargar los usuarios:', err);
          this.notificationService.error('Error al cargar los usuarios');
        }
      });
    }
  }

  toggleInactiveUsers() {
    // Método para alternar la visualización de usuarios inactivos (desactivado visualmente)
    this.loadUsers(); // Esto ya actualiza la paginación
  }

  filterData() {
    const texto = this.searchText.toLowerCase().trim();

    if (!texto) {
      // Si no hay texto de búsqueda, usamos todos los datos originales
      this.filteredData = [...this.originalData];
    } else {
      // Filtramos los datos
      this.filteredData = this.originalData.filter(usuario =>
        usuario.userFirstName.toLowerCase().includes(texto) ||
        usuario.userLastName.toLowerCase().includes(texto) ||
        usuario.userDNI.includes(texto) ||
        usuario.userEmail.toLowerCase().includes(texto) ||
        usuario.userPhone.includes(texto) ||
        usuario.role.toLowerCase().includes(texto)
      );
    }
    
    // Aplicamos la paginación a los datos filtrados
    this.applyPagination(0, 5);
  }

  handleUserAdded(newUser: any): void {
    console.log(newUser);
    this.authService.registerUser(newUser).subscribe({
      next: (data) => {
        console.log('Usuario creado con éxito:', data);
        this.notificationService.success('Usuario creado con éxito');
        this.loadUsers(); // Esto ya actualiza la paginación
      },
      error: (err) => {
        console.error('Error al crear el usuario:', err);
        this.notificationService.error('Error al crear el usuario');
      }
    });
  }

  handleUserSet(id:number,newUser: any): void {
    console.log(newUser);
    newUser.active = true
    console.log(newUser);
    this.userService.updateUser(id, newUser).subscribe({
      next: (updatedUser) => {
        console.log('Usuario actualizado:', updatedUser);
        this.notificationService.success('Usuario actualizado con éxito');
        this.loadUsers(); // Esto ya actualiza la paginación
      },
      error: (err) => {
        console.error('Error actualizando usuario:', err);
        this.notificationService.error('Error al actualizar el usuario');
      }
    });
  }

  handleDeleteUser(user: any) {
    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        console.log(`Usuario con ID ${user.id} eliminado.`);
        this.notificationService.success('Usuario eliminado con éxito');
        this.loadUsers(); // Esto ya actualiza la paginación
      },
      error: (err) => {
        console.error('Error al eliminar usuario:', err);
        this.notificationService.error('Error al eliminar el usuario');
      }
    });
  }
  
  onDelete(row: any) {
    const ref = this.dialogService.open(ConfirmModalComponent, {
      data: {
        detailsCupo: {
          title: "Esta seguro  de eliminar a :",
          start: row.userFirstName + " "+row.userLastName,
        },
      },
      width: '400px',
      modal: true,
      dismissableMask: false,
    });

    ref.onClose.subscribe(result => {
      if (result==true) {
        console.log(row)
        console.log(result);
        this.handleDeleteUser(row)
      } else {
        console.log('modal cerrado');
      }
    });
  }

  create() {
    const summitData = {
      tittle: 'Crear usuario',
      fields: this.fields
    }

    const ref = this.dialogService.open(SharedFormComponent, {
      data:summitData,
      dismissableMask:true,
    });

    ref.onClose.subscribe(result => {
      if (result) {
        console.log(result);
        this.handleUserAdded(result);
      } else {
        console.log('modal cerrado');
      }
    });
  }

  onTableLazyLoad(event: any) {
    const first = event.first || 0;
    const rows = event.rows || 5;
    
    // Aplicamos la paginación a los datos filtrados
    this.applyPagination(first, rows);
  }

  private applyPagination(first: number, rows: number) {
    // Aplicamos la paginación a los datos filtrados
    this.data = this.filteredData.slice(first, first + rows);
  }
}

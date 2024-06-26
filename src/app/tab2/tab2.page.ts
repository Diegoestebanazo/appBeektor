import { Component, OnChanges } from '@angular/core';
import { Hive } from '../Interfaces/interfaces';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { catchError, tap } from 'rxjs';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  listHive: Hive[] = [];
  infoUser: any;

  isActionSheetOpen = false;
  public actionSheetButtons = [
    {
      text: 'Salir',
      role: 'destructive',
      data: {
        action: 'delete',
      },
    },
  ];

  constructor(private router: Router, private ServiceApi: ApiService,
    private alertController: AlertController) {
    //this.testHive();
    this.init();

  }

  init() {
    let valueToken = localStorage.getItem('infoUser');
    let token: any;
    if (valueToken) {
      token = JSON.parse(valueToken);
    }
    this.infoUser = token;
    this.getListHive();
  }



  getListHive() {
    this.ServiceApi.getListHive().pipe(tap((res) => {

      this.listHive = res;
      /* this.router.navigate(['/tabs/tab2']); */
    }),
      catchError(async (err) => {
        console.log(err);
        const alert = await this.alertController.create({
          header: 'Error',
          message: err.error.msg,
          buttons: ['OK'],
        });
        await alert.present();
      }),
    ).subscribe();
  }

  async selectHive(hive: Hive) {
    if (hive.solicitud) {
      localStorage.setItem('colmena', JSON.stringify(hive));
      this.router.navigate(['/tabs/tab3']);
    } else {
      const alert = await this.alertController.create({
        header: 'Warning',
        message: 'La colmena aun no ha sido aceptada por el administrador',
        buttons: ['OK'],
      });
      await alert.present();
      localStorage.setItem('colmena', JSON.stringify(hive));
      this.router.navigate(['/tabs/tab3']);
    }

  }

  changeEstate(hive: Hive) {

    this.ServiceApi.changeEstate(hive._id!).pipe(tap((res) => {
      //console.log(res);
      hive.estado = !hive.estado;
    })).subscribe();
  }

  setOpen(isOpen: boolean, evnet?: any) {
    if (evnet) {
      if (evnet.detail.data) {
        localStorage.removeItem('colmena');
        localStorage.removeItem('infoUser');
        this.router.navigate(['/tabs/tab1']);
      }
    }
    this.isActionSheetOpen = isOpen;
  }

}

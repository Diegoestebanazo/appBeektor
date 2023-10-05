import { Component } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { ApiService } from '../services/api.service';
import { Hive, HiveSensor } from '../Interfaces/interfaces';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs';
import { ActionSheetController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  sensores: HiveSensor = { __v: 0, _id: '', colmena: '', humedad: '', temperatura: '', };
  colmena: Hive = { _id: null, nombre: '', observacion: '', produccion: '', estado: false, fecha: new Date() };
  infoUser: any;
  gaugeType = 'arch' as const;
  gaugeValue = 0;
  gaugeValueHumedad = 0;
  gaugeLabel = 'Temperatura';
  gaugeAppendText = '°C';
  backgroundColor = '#eee';
  thresholdConfig = {
    '0': { color: 'green', bgOpacity: 0.2 },
    '40': { color: 'orange', bgOpacity: 0.2 },
    '75.5': { color: 'red', bgOpacity: 0.2 },
  };

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

  constructor(private socketService: SocketService,
    private serviceApi: ApiService, private router: Router,
    private alertController: AlertController,
  ) { }

  ngOnInit(): void {
    let valueToken = localStorage.getItem('infoUser');
    let token: any;
    if (valueToken) {
      token = JSON.parse(valueToken);
    }
    this.infoUser = token;
    this.init();
  }

  init() {
    let col = localStorage.getItem('colmena');
    if (col) {
      this.colmena = JSON.parse(col);
      this.serviceApi.getSensorByColmena(this.colmena._id!).pipe(tap((data: HiveSensor) => {
        this.sensores = data;
        this.igual(data);
      }), catchError(async (err) => {
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

    this.socketService.getSensores().pipe(tap((data) => {
      this.sensores = data;
      this.igual(data);
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

  igual(res: HiveSensor) {
    this.gaugeValue = parseFloat(res.temperatura);
    this.gaugeValueHumedad = parseFloat(res.humedad);
  }

  back() {
    this.router.navigate(['/tabs/tab2']);
  }

  setOpen(isOpen: boolean, evnet?: any) {
    console.log('setOpen', evnet);
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

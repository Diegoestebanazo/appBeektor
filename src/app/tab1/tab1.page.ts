import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { catchError, tap } from 'rxjs';
import { Tab2Page } from '../tab2/tab2.page';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  formLogin!: FormGroup;
  @ViewChild(Tab2Page) tab2Page!: Tab2Page;

  constructor(public fb: FormBuilder, private router: Router,
    private alertController: AlertController, private ServiceApi: ApiService,
  ) {
    this.formBuilder();
  }

  ngOnInit() {

  }



  formBuilder() {
    this.formLogin = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(3)]]
    })
  }

  async login() {
    if (this.formLogin.valid) {

      this.ServiceApi.login(this.formLogin.value).pipe(tap((res) => {
        console.log(res);
        localStorage.setItem('infoUser', JSON.stringify(res));

        /* this.router.navigate(['/tabs/tab2']); */
        window.location.href = "/tabs/tab2";

      }),
        catchError(async (err) => {
          const alert = await this.alertController.create({
            header: 'Error',
            message: err.error.msg,
            buttons: ['OK'],
          });
          await alert.present();
        }),
      ).subscribe();
    } else {
      console.log('Formulário inválido');
      const alert = await this.alertController.create({
        header: 'Erro',
        message: 'Formulário inválido',
        buttons: ['OK']
      });
      await alert.present();
    }
  }
}

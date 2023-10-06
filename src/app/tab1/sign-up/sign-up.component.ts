import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { catchError, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  formLogin!: FormGroup;

  constructor(public fb: FormBuilder, private router: Router,
    private alertController: AlertController, private ServiceApi: ApiService,) {
    this.formBuilder();
  }

  ngOnInit() { }


  formBuilder() {
    this.formLogin = this.fb.group({
      usuario: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(3)]]
    })
  }

  async createAccount() {
    if (this.formLogin.valid) {
      console.log('Formulário válido');
      this.ServiceApi.newAccount(this.formLogin.value).pipe(tap((res) => {
        console.log(res);
        localStorage.setItem('infoUser', JSON.stringify(res));
        this.router.navigate(['/tabs/tab1']);
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

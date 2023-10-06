import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-add-panal',
  templateUrl: './add-panal.component.html',
  styleUrls: ['./add-panal.component.scss'],
})
export class AddPanalComponent implements OnInit {
  formNewPanal!: FormGroup;
  productosTemperatura: any[] = [];
  productosHumedad: any[] = [];

  constructor(public fb: FormBuilder, private ServiceApi: ApiService, private router: Router,) {
    this.formBuilder();
    this.getProductosTemperatura();
  }

  ngOnInit() { }

  formBuilder() {
    this.formNewPanal = this.fb.group({
      nombre: ['', Validators.required],
      ubicacion: ['', Validators.required],
      produccion: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      peso: ['', Validators.required],
      observacion: ['', Validators.required],
      productoTemperatura: ['', Validators.required],
      productoHumedad: ['', Validators.required],
    })
  }

  getProductosTemperatura(): void {
    this.productosTemperatura = [];
    this.productosHumedad = [];
    this.ServiceApi.getProducto().subscribe((res: any) => {
      res.forEach((element: any) => {
        if (element.categoria == 'Temperatura') {
          element.label = ' $ ' + element.precio + ' - ' + element.nombre;
          this.productosTemperatura.push(element);
        } else {
          element.label = ' $ ' + element.precio + ' - ' + element.nombre;
          this.productosHumedad.push(element);
        }
      });
      console.log(this.productosTemperatura);
      console.log(this.productosHumedad);
    });
  }

  addColmena() {
    console.log(this.formNewPanal.value);
    if (this.formNewPanal.valid) {
      this.ServiceApi.createColmena(this.formNewPanal.value).subscribe((res: any) => {
        //console.log(res);
        this.router.navigate(['/tabs/tab2']);
      });
    }
  }
}

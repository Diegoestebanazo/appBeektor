import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Hive, HiveSensor } from '../Interfaces/interfaces';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  get token(): string {
    let valueToken = localStorage.getItem('infoUser');
    let token: any;
    if (valueToken) {
      token = JSON.parse(valueToken);
    }
    return token?.accessToken || '';
  }

  get headers() {
    return {
      headers: {
        'authorization': 'Bearer ' + this.token,
      },
    };
  }

  login(json: any) {
    const URL = `${environment.url}usuarios/login`;
    return this.http.post<any>(URL, json);
  }

  getListHive() {
    const URL = `${environment.url}colmenas/myColmenas`;
    return this.http.get<Hive[]>(URL, this.headers).pipe(map((res: any) => {
      let value: Hive[] = [];
      res.forEach((element: any) => {
        value.push({
          _id: element._id,
          nombre: element.nombre,
          observacion: element.observacion,
          produccion: element.produccion,
          estado: element.estado,
          solicitud: element.solicitud,
          fecha: new Date(element.fecha),
        });
      });
      return value;
    }));
  }

  changeEstate(idEstate: string) {
    const URL = `${environment.url}colmenas/cambiarEstado/${idEstate}`;
    return this.http.put<any>(URL, {}, this.headers);
  }

  getSensorByColmena(idColmena: string) {
    const URL = `${environment.url}sensores/lastSensorByColmena/${idColmena}`;
    return this.http.get<HiveSensor>(URL, this.headers);
  }

  newAccount(json: any) {
    const URL = `${environment.url}usuarios`;
    return this.http.post<HiveSensor>(URL, json);
  }


  getProducto(): Observable<any> {
    const URL = `${environment.url}productos`;
    return this.http.get<any>(URL).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  createColmena(colmena: any): Observable<any> {
    const URL = `${environment.url}colmenas`;
    return this.http.post<any>(URL, colmena, this.headers).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
}

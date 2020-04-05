import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EstadoBr } from '../models/estado-br.model';
import { map } from '../../../../node_modules/rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class DropdownService {

  constructor(private http: HttpClient) { }

  getEstadosBr(){
    return this.http.get<EstadoBr[]>('assets/dados/estadosbr.json');


  }
}

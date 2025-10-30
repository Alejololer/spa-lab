import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Producto {
  id?: number;
  codigo: string;
  nombre: string;
  costo: number;
  precio: number;
  valor?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private productos: Producto[] = [];

  constructor() {
    const raw = (typeof window !== 'undefined' && window.localStorage) ? localStorage.getItem('productos') : null;
    this.productos = raw ? JSON.parse(raw) : [];
  }

  private guardar() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('productos', JSON.stringify(this.productos));
    }
  }

  listar() {
    return of(this.productos).pipe(delay(300));
  }

  agregar(p: Producto) {
    p.id = Date.now();
    this.productos.push(p);
    this.guardar();
    return of(p).pipe(delay(300));
  }

  actualizar(p: Producto) {
    const idx = this.productos.findIndex(x => x.id === p.id);
    if (idx >= 0) this.productos[idx] = p;
    this.guardar();
    return of(p).pipe(delay(300));
  }

  eliminar(id: number) {
    this.productos = this.productos.filter(x => x.id !== id);
    this.guardar();
    return of(true).pipe(delay(200));
  }
}

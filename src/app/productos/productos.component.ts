import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Producto, ProductoService } from '../services/producto.service';

function codigoProductoValidator(control: AbstractControl): ValidationErrors | null {
  const val = control.value as string;
  if (!val) return null;
  const valid = /^[A-Za-z]\d+$/.test(val);
  return valid ? null : { codigoInvalido: true };
}

function precioRangoValidator(control: AbstractControl): ValidationErrors | null {
  const val = control.value;
  if (val === null || val === undefined || val === '') return null;
  const num = parseFloat(val);
  if (isNaN(num)) return { precioInvalido: true };
  return num >= 10 && num <= 100 ? null : { precioFueraRango: true };
}

function costoMayorCeroValidator(control: AbstractControl): ValidationErrors | null {
  const val = control.value;
  if (val === null || val === undefined || val === '') return null;
  const num = parseFloat(val);
  return num > 0 ? null : { costoInvalido: true };
}

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent implements OnInit {
  form: FormGroup;
  productos: Producto[] = [];
  editId: number | null = null;
  editando = false;
  cargando = false;

  constructor(private fb: FormBuilder, private productoService: ProductoService) {
    this.form = this.fb.group({
      codigo: ['', [Validators.required, codigoProductoValidator]],
      nombre: ['', [Validators.required, Validators.minLength(5)]],
      costo: ['', [Validators.required, costoMayorCeroValidator]],
      precio: ['', [Validators.required, precioRangoValidator]],
      valor: ['']
    });
  }

  ngOnInit(): void {
    this.listar();
  }

  get codigo() { return this.form.get('codigo')!; }
  get nombre() { return this.form.get('nombre')!; }
  get costo() { return this.form.get('costo')!; }
  get precio() { return this.form.get('precio')!; }
  get valor() { return this.form.get('valor')!; }

  guardar() {
    if (this.form.invalid) return alert('Complete los campos');
    const data = this.form.value as Producto;
    if (this.editId) {
      data.id = this.editId;
      this.productoService.actualizar(data).subscribe(p => {
        this.listar();
        this.cancelar();
      });
    } else {
      this.productoService.agregar(data).subscribe(p => {
        this.listar();
        this.form.reset();
      });
    }
  }

  listar() {
    this.cargando = true;
    this.productoService.listar().subscribe(list => {
      this.productos = list || [];
      this.cargando = false;
    });
  }

  eliminar(id?: number) {
    if (!id) return;
    if (!confirm('¿Eliminar producto?')) return;
    this.productoService.eliminar(id).subscribe(() => this.listar());
  }

  editar(p: Producto) {
    this.editId = p.id || null;
    this.editando = true;
    this.form.patchValue({
      codigo: p.codigo,
      nombre: p.nombre,
      costo: p.costo,
      precio: p.precio,
      valor: p.valor
    });
  }

  cancelar() {
    this.editando = false;
    this.editId = null;
    this.form.reset();
  }

  reset() { this.form.reset(); }
}

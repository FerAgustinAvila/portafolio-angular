import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../interfaces/producto.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  cargando = true;
  productos: Producto[] = [];
  productosFiltrado: Producto[] = [];
  loadFiltro = true;
  filtroNoFound = false;

  constructor( private http: HttpClient ) { 

    this.cargarProductos();
  }

  private cargarProductos() {

    return new Promise( ( resolve, reject) => {
      this.http.get('https://angular-html-avila.firebaseio.com/productos_idx.json')
      .subscribe( (resp: Producto[] ) => {

          //  console.log(resp);
           this.productos = resp;
           setTimeout( () => {
               this.cargando = false;
           }, 1500);
            resolve();
      });

    });

    
  }

  getProducto( id: string ){
    return this.http.get(`https://angular-html-avila.firebaseio.com/productos/${ id }.json`);
  }


  buscarProducto( termino: string ){

    if( this.productos.length === 0 ){
      this.cargarProductos().then( () => {
        
      });
    } else {
      this.filtrarProductos( termino );
    };
  }

  private filtrarProductos( termino: string ){
    // console.log(this.productos);
    this.productosFiltrado = [];

    termino = termino.toLocaleLowerCase();
    

    this.productos.forEach( prod =>{

      const tituloLow = prod.titulo.toLocaleLowerCase();

      if( prod.categoria.indexOf( termino ) >= 0 || tituloLow.indexOf( termino ) >= 0 ){
        this.productosFiltrado.push( prod );
      }
    });
    if (this.productosFiltrado.length > 0 ) {
      this.loadFiltro = false;
      this.filtroNoFound = false;
    } else {
      this.loadFiltro = false;
      this.filtroNoFound = true;
    }
  }
}

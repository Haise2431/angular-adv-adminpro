import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: [
  ]
})
export class PromesasComponent implements OnInit {
   ngOnInit(): void {

    this.getUsuarios().then( usuario => {
      console.log(usuario);
    })
    return;

     const promesa = new Promise(( resolve, reject) => {
      if ( false ) {
        resolve ('Hola Mundo')
      } else {
        reject('Algo salio mal');
      }
      

     });

     promesa.then((mensaje) => {
        console.log(mensaje);
     })
     .catch( error => console.log(`Error en mi promesa`, error));

     console.log('Fin del Init');

   }

   getUsuarios = () => new Promise( resolve => {
    fetch(`https://reqres.in/api/Users`)
    .then( resp => resp.json())
    .then( body => resolve(body.data));
  });
}

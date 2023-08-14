import { Component, OnDestroy } from '@angular/core';
import { Observable, Subscription, interval } from 'rxjs';
import { retry, take, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnDestroy {

  public intervalSubs: Subscription | undefined;
  
    constructor() {

      this.intervalSubs = this.retornaIntervalo().subscribe( console.log);

     /*
      this.retornaObservable().pipe(
        retry(1)
      )
      .subscribe(
        valor => console.log('Subs:', valor),
        (err) => console.warn('Error', err),
        () => console.info('Terminado')
      ); */

    }
  ngOnDestroy(): void {
    this.intervalSubs?.unsubscribe();
  }

    retornaIntervalo() {
      const interval$ = interval(1000).pipe(
        map( valor => valor + 1),
        filter( valor => valor % 2 === 0 ? true : false),
        take(10),
        
      );
      return interval$;
    }

    retornaObservable() {
      let i = -1;

      const obs$ = new Observable( observer => {
        
        const intervalo = setInterval( () => {
          i++;
          observer.next(i);
          if ( i === 4) {
            clearInterval( intervalo );
            observer.complete();
          }

          if (i === 2) {
            console.log('i = 2.... error');
            observer.error('i llego al valor de 2');
          }

        }, 1000);
      });

      return obs$;
    }
}

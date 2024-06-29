

import { Injectable } from '@angular/core';
import { orthographyUseCase } from '@use-cases/index';
import { from } from 'rxjs';
import { prosConsDiscusserUseCase } from '../../core/use-cases/prosConsDiscusser/prosConsDiscusser.use-case';

@Injectable({providedIn: 'root'})
export class OpenAiService {
    // con from convierto la promesa en un observable
   chekOrthography( prompt: string ){
    return from (orthographyUseCase( prompt ));
   };
   makeProsCons( prompt: string ) {
    return from (prosConsDiscusserUseCase( prompt ));
   }
    
}
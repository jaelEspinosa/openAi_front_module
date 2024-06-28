

import { Injectable } from '@angular/core';
import { orthographyUseCase } from '@use-cases/index';
import { from } from 'rxjs';

@Injectable({providedIn: 'root'})
export class OpenAiService {
    // con from convierto la promesa en un observable
   chekOrthography( prompt: string ){
    return from (orthographyUseCase( prompt ));
   }
    
}
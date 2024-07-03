

import { Injectable } from '@angular/core';
import { orthographyUseCase, prosConsDiscusserUseCase, prosConsStreamUseCase, textToAudioUseCase, transalteUseCase } from '@use-cases/index';
import { from } from 'rxjs';


@Injectable({providedIn: 'root'})
export class OpenAiService {
    // con from convierto la promesa en un observable
   chekOrthography( prompt: string ){
    return from (orthographyUseCase( prompt ));
   };
   makeProsCons( prompt: string ) {
    return from (prosConsDiscusserUseCase( prompt ));
   };

   makeProsConsStream( prompt: string, abortSignal: AbortSignal ) {
    return prosConsStreamUseCase( prompt, abortSignal );
   };

   makeTranslation( prompt: string, lang: string) {
    return from( transalteUseCase(prompt, lang))
   };

   textToAudio( prompt: string, voice: string) {
    return from( textToAudioUseCase(prompt, voice))
   };
    
}
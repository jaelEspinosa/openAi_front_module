import { AudioToTextResponse } from "@interfaces/index";
import { environment } from "environments/environment.development";


export const audioTotextUseCase = async ( file: File, prompt?: string) => {

    try {
        
        const formData = new FormData();
        formData.append('file', file);
        
        if( prompt ){
            formData.append('prompt', prompt);
        }

        const resp = await fetch(`${ environment.backendApi}/audio-to-text`,{
            method: 'POST',
            body: formData
        });

        if(!resp.ok) throw new Error('No se pudo generar el Texto.');

        const response = await resp.json() as AudioToTextResponse

        return {
            ok: true,
            message: '',
            text: response
          
        }
        
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'No se pudo generar el audio.',
            text: null
        }
    }

}
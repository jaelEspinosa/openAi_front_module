

import { ImageGenerateResponse } from "@interfaces/index";
import { environment } from "environments/environment.development";


export const imageVariationUseCase = async (      
    baseImage: string,    
) => {

    try {
       
        const resp = await fetch(`${ environment.backendApi }/image-variation`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ baseImage })
        });

       
       if(!resp.ok) throw new Error('No se pudo generar la imagen.');

        const response = await resp.json() as ImageGenerateResponse

        return {
            ok: true,
            message: '',
            response
        }
        
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'No se pudo generar la imagen.',
            response: null
        }
    }

}
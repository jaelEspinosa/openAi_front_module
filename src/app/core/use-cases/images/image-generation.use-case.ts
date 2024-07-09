

import { ImageGenerateResponse } from "@interfaces/index";
import { environment } from "environments/environment.development";


export const imageGenerateUseCase = async (  
    prompt: string,
    originalImage?: string,
    maskImage?: string,
) => {

    try {

        const resp = await fetch(`${ environment.backendApi }/image-generation`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt, originalImage, maskImage })
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
import { ProsConsResponse } from "@interfaces/pros-cons.response.interface";
import { environment } from "environments/environment"


export const prosConsDiscusserUseCase =  async (prompt: string) => {


    try {

        const resp = await fetch(`${ environment.backendApi }/pros-cons-discusser`, {
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt })
        });

        if(!resp.ok) throw new Error('No se ha podido realizar la comparación.')
        const data = await resp.json() as ProsConsResponse;
        return {
            ok: true,
            ...data
        }
        
    } catch (error) {
        console.log( error )
        return {
            role: '',
            ok: false,
            content: 'No se pudo realizar la comparación.'
        }
    }
}
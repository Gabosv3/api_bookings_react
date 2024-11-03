import axios from "axios";
import { defaultAxiosWithToken } from "../utils/http";
import { useQuery } from "@tanstack/react-query";

const getAccomodations = async () => {
    
    //obtenemos el token que se guarda en el sessionstorage
    const token = sessionStorage.getItem('token_bookings')
    try{

        const response = await axios.get("https://apibookingsaccomodations-production.up.railway.app/api/V1/accomodations", {
            headers: {
                //agregamos el token para la autorizacion
                'Authorization': `Bearer ${token}`
            }
        });
        console.log("accomodations: ",response);        
        return response.data;
    }catch(error){
        console.error("Error al obtener los alojamientos", error);
        return []
    }
}

//Creando la función con el metodo post, que nos permitirá agregar un nuevo alojamiento
const createAccommodation = async (data) => {
    try {
        const response = await axios.post("https://apibookingsaccomodations-production.up.railway.app/api/V1/accomodation", data, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data; // Nos devuelve el nuevo alojamiento
    } catch (error) {
        console.error("Error al crear el alojamiento", error);
    }
}

export { getAccomodations, createAccommodation};

//other approach
const findAlAccomodations = async () => (await defaultAxiosWithToken.get('/accomodations')).data;

const useGetAccomodations = () => {
    const { data, isLoading, isError, isSuccess, error } = useQuery({
        queryKey: ['accomodations'],
        queryFn: () => findAlAccomodations(),
        refetchOnWindowFocus:false
    });
    return { data, isLoading, isError, isSuccess, error };
}

export { getAccomodations, useGetAccomodations }


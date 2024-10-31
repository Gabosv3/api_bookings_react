import axios from "axios";
import { defaultAxiosWithToken } from "../utils/http";
import { useQuery } from "@tanstack/react-query";

//obtenemos el token que se guarda en el sessionstorage
const token = sessionStorage.getItem('token_bookings')

const getAccomodations = async () => {
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
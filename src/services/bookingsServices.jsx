import axios from "axios";

const getBookings = async () => {

    try {
        const token = sessionStorage.getItem('token_bookings')

        const response = await axios.get('https://apibookingsaccomodations-production.up.railway.app/api/V1/bookings',
            {
                headers: {
                    //agregamos el token para la autorizacion
                    'Authorization': `Bearer ${token}`
                }
            }            
        )
        console.log("bookings: ",response);    
        return response.data    

    } catch (error) {
        console.error('Error al obtener los datos',error.message);
        return []
    }
}

export default getBookings
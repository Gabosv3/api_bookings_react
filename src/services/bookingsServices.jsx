import axios from "axios";


const token = sessionStorage.getItem('token_bookings')


const getBookings = async () => {

    try {
        const response = await axios.get('https://apibookingsaccomodations-production.up.railway.app/api/V1/bookings',
            {
                headers: {
                    //agregamos el token para la autorizacion
                    'Authorization': `Bearer ${token}`
                }
            }            
        )
        console.log(response);    
        return response.data    

    } catch (error) {
        console.error('Error al obtener los datos',error.message);
    }
}

//Al cancelar una reservacion debemos actualizar su estado
const updateStatusBooking = async (id, status) => {
    try {
        const response = await axios.patch(`https://apibookingsaccomodations-production.up.railway.app/api/V1/status_booking/${id}`, status,
            {
                headers: {
                    //agregamos el token para la autorizacion
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log("probando cancelar reservacion");
            console.log(response);
            return response.data;
    } catch (error) {
        console.error("Error al actualizar el estado de la reservacion", error);
    }
}

export { getBookings, updateStatusBooking}
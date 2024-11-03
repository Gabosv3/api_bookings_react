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
        return response.data    

    } catch (error) {
        console.error('Error al obtener los datos',error.message);
        return []
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

// traer bookings segun id de la accomodation

const getBookingsByAccomodationId = async (id) => {

    try {
        const token = sessionStorage.getItem('token_bookings')

        const response = await axios.get(`https://apibookingsaccomodations-production.up.railway.app/api/V1/bookings/calendar/${id}`,
            {
                headers: {
                    //agregamos el token para la autorizacion
                    'Authorization': `Bearer ${token}`
                }
            }            
        )
        console.log("booking by id: ",response.data);    
        return response.data    

    } catch (error) {
        console.error('Error al obtener los datos',error.message);
        return []
    }

}

const getUserOfBookings = async () => {

    const bookings = await getBookings()

    const names = bookings.map((booking) => booking.user)

    const user = names.filter((value, i, self) => self.indexOf(value) === i);

    return user
}

export { getBookings, getBookingsByAccomodationId, updateStatusBooking, getUserOfBookings}
import axios from "axios";

//obtenemos el token que se guarda en el sessionstorage
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
        return response.data

    } catch (error) {
        console.error('Error al obtener los datos', error.message);
        return []
    }
}

//Al cancelar una reservacion debemos actualizar su estado
const updateStatusBooking = async (id) => {
    try {
      const response = await axios.patch(
        `https://apibookingsaccomodations-production.up.railway.app/api/V1/status_booking/${id}`,
        { status: 'CANCELLED' },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );
  
      //verifica si la respuesta fue exitosa
      if (response.status !== 200) {
        throw new Error(`Error ${response.status}: No se pudo cancelar la reservación`);
      }
  
      // Devuelve los datos si todo fue exitoso
      return response.data; 
    } catch (error) {
      console.error("Error al actualizar el estado de la reservación", error);
      throw error; // Lanza el error para manejarlo donde se llame el servicio
    }
  };

// traer bookings segun id de la accomodation

const getBookingsByAccomodationId = async (id) => {

    try {

        const response = await axios.get(`https://apibookingsaccomodations-production.up.railway.app/api/V1/bookings/calendar/${id}`,
            {
                headers: {
                    //agregamos el token para la autorizacion
                    'Authorization': `Bearer ${token}`
                }
            }
        )
        console.log("booking by id: ", response.data);
        return response.data

    } catch (error) {
        console.error('Error al obtener los datos', error.message);
        return []
    }

}

const getUserOfBookings = async () => {

    const bookings = await getBookings()

    const names = bookings.map((booking) => booking.user)

    const user = names.filter((value, i, self) => self.indexOf(value) === i);

    return user
}

export { getBookings, getBookingsByAccomodationId, updateStatusBooking, getUserOfBookings }
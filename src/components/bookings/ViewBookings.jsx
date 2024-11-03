import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';
// materialUI
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Spinner from "react-bootstrap/Spinner";
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
// getDataAPI
import { getAccomodations } from '../../services/accomodationServices'
import { getBookings, getBookingsByAccomodationId, getUserOfBookings } from '../../services/bookingsServices';
// calendar
import BookingsCalendar from './BookingsCalendar';
// components
import NewBookingModal from "./NewBookingModal";


export default function ViewBookings() {
  // estados para la informacion traida de la api
  const [accomodations, setAccomodations] = useState([]);
  const [bookings, setBookings] = useState([])
  // estados para el control de las vistas
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // estados para el control de los renderizados
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // estados para el manejo de busquedas y los eventos mostrados en el calendar
  const [user, setUser] = useState([])
  const [events, setEvents] = useState([])
  const [allEvents, setAllEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true)
  const [selectedAccomodation, setSelectedAccomodation] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedName, setSelectedName] = useState('')


  const fetchData = async () => {
    
    setLoading(true)
    try {
      const session_token = sessionStorage.getItem("token_bookings");

      if (session_token) {
        setIsAuthenticated(true);

        const responseAccomodations = await getAccomodations();
        const responseBookings = await getBookings();
        const names = await getUserOfBookings()

        setAccomodations(responseAccomodations);
        setBookings(responseBookings);
        setUser(names)

        const eventFromBookings = responseBookings.map((booking) => ({     
          id: booking.id,
          title: booking.user,
          people: [booking.user],
          start: booking.check_in_date,
          end: booking.check_out_date,
          calendarId: booking.status,
          description: booking.status,
          location: booking.accomodation
        }))

        setEvents(eventFromBookings)      
        setAllEvents(eventFromBookings)  
      } else {
        setIsAuthenticated(false);
      }      
    } catch (error) {
      console.error("Error al obtener la información:", error);
    } finally {     
      setLoading(false);
    }
  };  

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    
    if (selectedAccomodation || selectedState || selectedName) {
        setEventsLoading(true);
        let status = ''
        if(selectedState == 'Confirmada') status = 'CONFIRMED'
        if(selectedState == 'Cancelada') status = 'CANCELLED' 

        const fetchFilteredEvents = () => {
            const filteredEvents = bookings
                .filter((booking) => {
                    // Apply each filter conditionally
                    const matchesAccommodation = selectedAccomodation ? booking.accomodation === selectedAccomodation : true;
                    const matchesStatus = selectedState ? booking.status === status : true;
                    const matchesUser = selectedName ? booking.user === selectedName : true;

                    return matchesAccommodation && matchesStatus && matchesUser;
                })
                .map((booking) => ({
                    id: booking.id,
                    title: booking.booking.toUpperCase(),
                    people: [booking.user],
                    start: booking.check_in_date,
                    end: booking.check_out_date,
                    calendarId: booking.status,
                    description: booking.status,
                    location: booking.accomodation
                }));

            setEvents(filteredEvents.length > 0 ? filteredEvents : allEvents);

            if (filteredEvents.length === 0) {
                Swal.fire({
                    title: "No se encontraron reservaciones",
                    text: "Intenta con otros filtros",
                    icon: "info",
                    confirmButtonText: "Entendido",
                });
                // Reset to show all events if no filters are selected
                setEvents(allEvents);
                setEventsLoading(false);
    
            }

            setEventsLoading(false);
        };

        fetchFilteredEvents();
    } else {
        // Reset to show all events if no filters are selected
        setEvents(allEvents);
        setEventsLoading(false);
    }
}, [selectedAccomodation, selectedState, selectedName, bookings, allEvents]);



  return (
    <>
      <div className='w-100'>
        <div className='d-flex justify-content-center flex-column'>      
          <div>
            {console.log("estado: ",loading, " estadooo: ", eventsLoading)
            }
            {              
              loading || eventsLoading ? (
                <div className="d-flex justify-content-center align-items-center vh-100">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </Spinner>
                </div>
              ) 
              :               
              (    
                <>            
                  <div className='d-flex flex-column justify-content-center align-content-center pb-3'>
                    <div className='w-100 d-flex justify-content-end gap-3'>                  
                                        
                      <Button 
                        variant='text' 
                        color='grey' 
                        onClick={()=> setEvents()}
                        startIcon={<FilterAltIcon />}>
                          Filtros
                      </Button>

                      <Button variant="contained" 
                        color="primary" 
                        onClick={() => setIsModalOpen(true)}
                        startIcon={<AddIcon />}>
                          Nueva Reservación
                      </Button>
                      {isModalOpen && (
                        <>
                            {/* Renderiza el backdrop */}
                            <div className="modal-backdrop fade show"></div>
                            <NewBookingModal
                                isOpen={isModalOpen}
                                onClose={() => setIsModalOpen(false)}
                            />
                        </>
                    )}
                    </div>

                    <div className='d-flex justify-content-around align-content-center w-100'>
                      { /** mostrar select alojamientos */}
                      <Autocomplete
                          disablePortal
                          options={accomodations.map((accomodation) => (
                            accomodation.name
                          ))}
                          className='w-25'
                          onChange={(e,value) => setSelectedAccomodation(value)}
                          renderInput={(params) => <TextField {...params} label="Alojamientos" variant="standard"/>
                        }
                      />

                      { /** mostrar select estados de bookings */}

                      <Autocomplete
                          disablePortal
                          options={["Confirmada", "Pendiente", "Cancelada"]}
                          className='w-25'
                          onChange={(e) => setSelectedState(e.target.textContent)}
                          renderInput={(params) => <TextField {...params} label="Estado" variant="standard"/>
                        }
                      />
                      {/* mostrar buscador por nombre */}
                      <Autocomplete
                          freeSolo
                          id="search-by-name"
                          className='w-25'
                          onChange={(e, value) => setSelectedName(value)}
                          options={user}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Nombre del huésped"
                              variant="standard"
                              
                              slotProps={{
                                input: {
                                  ...params.InputProps,
                                  type: 'search',
                                },
                              }}
                            />
                          )}
                      />
                    </div>
                  </div>

                  {/* Only show BookingsCalendar if bookings data is available */}
                  {!eventsLoading && events.length > 0 ? (<BookingsCalendar events={events.length > 0 ? events: allEvents} />) : (<p>Cargando calendario desde view</p>)}
                    
                </>
              )
            }            
          </div>
        </div>     
      </div>
    </>
  )
}
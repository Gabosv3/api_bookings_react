import React, { useEffect, useState } from 'react'

// materialUI
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Spinner from "react-bootstrap/Spinner";
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
// getDataAPI
import { getAccomodations } from '../../services/accomodationServices'
import { getBookings, getBookingsByAccomodationId } from '../../services/bookingsServices';
// calendar
import BookingsCalendar from './BookingsCalendar';
// components
import NewBookingModal from "./NewBookingModal";


export default function ViewBookings() {
  const [accomodations, setAccomodations] = useState([]);
  const [bookings, setBookings] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState([])
  const [eventsLoading, setEventsLoading] = useState(true)
  const [selectedAccomodation, setSelectedAccomodation] = useState('');
  const [allEvents, setAllEvents] = useState([]);


  const fetchData = async () => {

    try {
      const session_token = sessionStorage.getItem("token_bookings");

      if (session_token) {
        setLoading(true);
        setEventsLoading(true);
        setIsAuthenticated(true);

        const responseAccomodations = await getAccomodations();
        const responseBookings = await getBookings();

        setAccomodations(responseAccomodations);
        setBookings(responseBookings);

        const eventFromBookings = responseBookings.map((booking) => ({     
          id: booking.id,
          title: booking.user,
          start: booking.check_in_date,
          end: booking.check_out_date,
          calendarId: booking.status,
          description: booking.status
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
      setEventsLoading(false);
    }
  };  

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(()=> {
    setEventsLoading(true)
    console.log(selectedAccomodation);
    
    const fetchEventsByAccomodations = () => {

      const selected = bookings
      .filter((booking) => booking.accomodation == selectedAccomodation)
      .map((booking)=> ({
          id: booking.id,
          title: booking.user,
          start: booking.check_in_date,
          end: booking.check_out_date,
          calendarId: booking.status,
          description: booking.status
        }))

        if(selected.length > 0){
          setEvents(selected)
        } else{
          alert(`No hay bookings para el alojamiento: ${selectedAccomodation}`)
          setEvents(allEvents)
        }
    }
    
    if(selectedAccomodation){
      fetchEventsByAccomodations()
    } else {
      setEvents(allEvents)
    }
    
    setEventsLoading(false)      
  },[selectedAccomodation, bookings, allEvents])

  return (
    <>
      <div className='w-100'>
        <div className='d-flex justify-content-center flex-column'>      
          <div>
            {
              loading && eventsLoading ? (
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
                                        
                      <Button variant='text' color='grey' startIcon={<FilterAltIcon />}>Filtros</Button>
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
                          onChange={(e, value) => setSelectedAccomodation(value)}
                          renderInput={(params) => <TextField {...params} label="Alojamientos" variant="standard"/>
                        }
                      />

                      { /** mostrar select estados de bookings */}

                      <Autocomplete
                          disablePortal
                          options={["Confirmada", "Pendiente", "Cancelada"]}
                          className='w-25'
                          renderInput={(params) => <TextField {...params} label="Estado" variant="standard"/>
                        }
                      />
                      {/* mostrar buscador por nombre */}
                      <Autocomplete
                          freeSolo
                          id="search-by-name"
                          className='w-25'
                          key={bookings.map((booking) => (
                            booking.id
                          ))}
                          disableClearable
                          options={bookings.map((booking) => booking.user)}
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
                  {console.log("antes de mandar por props", events)}
                  {console.log(eventsLoading)}
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
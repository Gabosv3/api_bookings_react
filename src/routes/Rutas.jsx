import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from '../components/auth/Login';
import Index from '../components/main/Index';
import ViewBookings from '../components/bookings/ViewBookings';
import BookingDetailsModal from '../components/bookings/BookingDetailsModal';

export default function Rutas() {
    const demoWindow = () => window; // Definir la función para la propiedad window

    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Index window={demoWindow} />}/>
                <Route path='/login' element={<Login />} />
                <Route path='/index' element={<Index window={demoWindow} />} /> {/* Pasa window a Index */}
                <Route path='/reservations' element={<ViewBookings />} />
                <Route path='/reservations_details' element={<BookingDetailsModal />} />
            </Routes>
        </BrowserRouter>
    );
}

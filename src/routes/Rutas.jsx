import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from '../components/auth/Login';
import Index from '../components/main/Index';
import Bookings from '../components/bookings/Bookings';

export default function Rutas() {
    const demoWindow = () => window; // Definir la función para la propiedad window

    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Index window={demoWindow} />}/>
                <Route path='/login' element={<Login />} />
                <Route path='/index' element={<Index window={demoWindow} />} /> {/* Pasa window a Index */}
                <Route path='/reservations' element={<Bookings />} />
            </Routes>
        </BrowserRouter>
    );
}

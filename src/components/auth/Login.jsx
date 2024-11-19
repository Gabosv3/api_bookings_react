import  { useEffect } from "react";
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from "sweetalert2"; // Importar SweetAlert2
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../assets/css/Login.css'; // Archivo CSS personalizado para agregar estilos adicionales
import { login } from '../../services/loginServices';

export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const location = useLocation(); // Hook para obtener la ubicación

    // Obtener el parámetro de la URL
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get("status");

    // Mostrar la alerta si la sesión se cerró
    useEffect(() => {
        if (status === "logged-out") {
            Swal.fire({
                icon: "success",
                title: "Sesión cerrada",
                text: "Tu sesión se ha cerrado correctamente.",
            });
        }
    }, [status]); // Solo se ejecuta cuando el valor de status cambia

    // Mapa de correos con sus contraseñas y hashes predefinidos
    const usersData = {
        "abner95@example.com": {
            password: '123456',
            hash: '$2y$12$uYSt7J5Zwqho9cUpTkWCW.I4OVojaUjwxHMBZs4DBc48xvH.6Rnxa'
        },
        "dicki.alexa@example.org": {
            password: '1234567',
            hash: '$2y$12$uYSt7J5Zwqho9cUpTkWCW.I4OVojaUjwxHMBZs4DBc48xvH.6Rnxa'
        },
        "nitzsche.americo@example.net": {
            password: '12345678',
            hash: '$2y$12$uYSt7J5Zwqho9cUpTkWCW.I4OVojaUjwxHMBZs4DBc48xvH.6Rnxa'
        },
        "kade40@example.com": {
            password: '123456789',
            hash: '$2y$12$uYSt7J5Zwqho9cUpTkWCW.I4OVojaUjwxHMBZs4DBc48xvH.6Rnxa'
        },
        "barbara.kemmer@example.net": {
            password: '1234567890',
            hash: '$2y$12$uYSt7J5Zwqho9cUpTkWCW.I4OVojaUjwxHMBZs4DBc48xvH.6Rnxa'
        }
    };

    const loginForm = async (data) => {
        try {
            // Verificamos si el correo ingresado existe en nuestra lista
            const user = usersData[data.email];
            if (user && data.password === user.password) {
                // Si el correo y la contraseña son correctos, enviamos el hash
                const hashData = {
                    email: data.email,
                    password: user.hash
                };

                const response = await login(hashData);
                if (response?.token) {
                    sessionStorage.setItem('token_bookings', response.token);
                    navigate('/index');
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Credenciales incorrectas. Por favor verifica tu correo y contraseña.',
                    });
                }
            } else {
                // Si el correo o la contraseña no coinciden, mostramos un mensaje de error
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Credenciales incorrectas. Por favor verifica tu correo y contraseña.',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error en el servidor',
                text: 'Hubo un problema en el servidor. Inténtalo de nuevo más tarde.',
            });
            console.error(error);
        }
    };

    return (
        <div className="login-container">
            <div className="card login-card shadow-lg">
                <h2 className="text-center mb-4"><i className="bi bi-box-arrow-in-right"></i> Iniciar Sesión</h2>
                <p className="text-center text-muted">Ingresa tus credenciales para acceder al sistema</p>
                <form onSubmit={handleSubmit(loginForm)}>
                    <div className="form-group mb-3">
                        <label htmlFor="email" className="form-label">Correo Electrónico</label>
                        <div className="input-group">
                            <span className="input-group-text"><i className="bi bi-envelope-fill"></i></span>
                            <input
                                type="email"
                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                placeholder="correo@ejemplo.com"
                                {...register('email', {
                                    required: 'El correo es obligatorio',
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                        message: 'Formato de correo no válido'
                                    }
                                })}
                            />
                        </div>
                        {errors.email && (
                            <div className="invalid-feedback">{errors.email.message}</div>
                        )}
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="password" className="form-label">Contraseña</label>
                        <div className="input-group">
                            <span className="input-group-text"><i className="bi bi-lock-fill"></i></span>
                            <input
                                type="password"
                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                placeholder="••••••••"
                                {...register('password', {
                                    required: 'La contraseña es obligatoria',
                                    minLength: {
                                        value: 6,
                                        message: 'La contraseña debe tener al menos 6 caracteres'
                                    }
                                })}
                            />
                        </div>
                        {errors.password && (
                            <div className="invalid-feedback">{errors.password.message}</div>
                        )}
                        <div className="d-flex justify-content-end">
                            <a href="#" className="link-primary small mt-1">¿Olvidaste tu contraseña?</a>
                        </div>
                    </div>
                    <div className="form-check mb-3">
                        <input type="checkbox" className="form-check-input" id="rememberMe" />
                        <label className="form-check-label" htmlFor="rememberMe">Mantener sesión iniciada</label>
                    </div>
                    <div className="d-grid mb-4">
                        <button type="submit" className="btn btn-dark btn-lg">
                            <i className="bi bi-box-arrow-in-right"></i> Iniciar Sesión
                        </button>
                    </div>
                </form>
                <p className="text-center">
                    <i className="bi bi-question-circle"></i> ¿Necesitas ayuda? <a href="#" className="link-primary">Contacta soporte</a>
                </p>
                <div className="text-center text-muted small">
                    <i className="bi bi-shield-lock"></i> Este es un sistema seguro. Tus datos están protegidos.
                </div>
            </div>
        </div>
    );
}

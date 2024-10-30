import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles";
import EventIcon from "@mui/icons-material/Event";
import AddHomeIcon from "@mui/icons-material/AddHome";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useDemoRouter } from "@toolpad/core/internal";

// Importa tus componentes
import Accomodations from "../accomodations/Accomodations";
import ViewBookings from "../bookings/Bookings";

// Define la navegación sin tipos
const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
  palette: {
    mode: "light", // O "dark", según tu preferencia
    background: {
      default: "#f0f0f0", // Color de fondo principal
      paper: "#ffffff", // Color de fondo para elementos como tarjetas o contenedores
    },
  },
});

function DemoPageContent({ pathname }) {
  return (
    <Box
      sx={{
        py: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        margin: "20px",
      }}
    >
      {/* Renderiza el componente basado en el pathname */}
      {pathname === "/Alojamiento" ? (
        <Accomodations />
      ) : pathname === "/Reservaciones" ? (
        <ViewBookings />
      ) : (
        <Typography>Bienvenido a la página de inicio</Typography> // Opcional: mensaje por defecto
      )}
    </Box>
  );
}

export default function DashboardLayoutNavigationActions(props) {
  const { window } = props;
  const router = useDemoRouter("/index");
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    const session_token = sessionStorage.getItem("token_bookings");
    if (session_token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);


  const demoWindow = window !== undefined ? window() : undefined;

  return isAuthenticated ? (
    <AppProvider
      branding={{
        logo: (
          <img
            src="https://cdn-icons-png.flaticon.com/512/562/562674.png"
            alt="BOOKINGS"
          />
        ),
        title: "BOOKINGS",
      }}
      navigation={[
        {
          segment: "Alojamiento",
          title: "Alojamiento",
          icon: <AddHomeIcon />,
        },
        {
          segment: "Reservaciones",
          title: "Reservaciones",
          icon: <EventIcon />,
        },
      ]}
      router={router}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout>
        <DemoPageContent pathname={router.pathname} />
      </DashboardLayout>
    </AppProvider>
  ) : (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Typography variant="h4">No estás autorizado, inicia sesión</Typography>
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

DashboardLayoutNavigationActions.propTypes = {
  window: PropTypes.func.isRequired,
};

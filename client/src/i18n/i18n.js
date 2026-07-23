import i18n from "i18next";
import { initReactI18next } from "react-i18next";
const resources = {
    en: {
        translation: {
            welcome: "Welcome",
            login: "Login",
            register: "Register",
            profile: "Profile",
            positions: "Positions",
            cvs: "CVs",
            admin: "Admin Panel",
            discussions: "Discussions",
            likes: "Likes",
            dashboard: "Main Dashboard"
        }
    },
    es: {
        translation: {
            welcome: "Bienvenido",
            login: "Iniciar sesión",
            register: "Registrarse",
            profile: "Perfil",
            positions: "Posiciones",
            cvs: "CVs",
            admin: "Panel de Administración",
            discussions: "Discusiones",
            likes: "Me gusta",
            dashboard: "Panel Principal"
        }
    }
};

i18n.use(initReactI18next).init({
    resources,
    lng: localStorage.getItem("lang") || "en",
    interpolation: { escapeValue: false }
});

export default i18n;

import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "leaflet/dist/leaflet.css";

// Contexts
import { AuthProvider, useAuth } from "./AuthContext";
import { CartProvider } from "./Context/CartContext";

// Navbars
import UserNavbar from "./components/UserNavbar";
import AdminNavbar from "./components/AdminNavbar";

// Pages publiques
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import { Catalogue } from "./session/user/Catalogue";
import Panier from "./session/user/Panier";

// Pages user privées
import { Accueil } from "./session/user/Accueil";
import Commande from "./session/user/Commande";
import MyCommande from "./session/user/MyCommande";
import { Contactuser } from "./session/user/Contactuser";

// Pages admin privées
import { A_accueil } from "./session/admin/A_accueil";
import { A_catalogue } from "./session/admin/A_Catalogue";
import { A_Commande } from "./session/admin/A_Commande";
import { Contact } from "./session/commons/Contact";
import { About } from "./session/commons/About";
import Home from "./session/commons/Home";
import { A_Message } from "./session/admin/A_Message";

// Navbar dynamique (conditionnée par le chemin)
const NavbarWrapper = () => {
  const { auth } = useAuth();
  const location = useLocation();

  // Chemins où la navbar ne doit PAS s'afficher
  const noNavbarPaths = ["/login", "/register"];
  
  // Si le chemin actuel est dans la liste des chemins sans navbar, retourner null
  if (noNavbarPaths.includes(location.pathname)) {
    return null;
  }

  if (auth.role === "admin") {
    return <AdminNavbar />;
  }

  // Si pas admin → UserNavbar (connecté ou pas)
  return <UserNavbar />;
};

// PrivateRoute simple
const PrivateRoute = ({ children, adminOnly }) => {
  const { auth, loading } = useAuth();

  if (loading) return <p>Chargement...</p>;

  if (!auth.user) return <p>Vous devez être connecté pour accéder à cette page.</p>;

  if (adminOnly && auth.role !== "admin")
    return <p>Vous n'avez pas les droits pour accéder à cette page.</p>;

  return children;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          {/*  Navbar conditionnée */}
          <NavbarWrapper />

          <Routes>
            {/* Pages publiques */}
            <Route path="/" element={<Home />} />
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/catalogue" element={<Catalogue />} />
            <Route path="/panier" element={<Panier />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/apropos" element={<About />} />

            {/* Pages user privées */}
            <Route
              path="/accueil"
              element={
                <PrivateRoute>
                  <Accueil />
                </PrivateRoute>
              }
            />
            <Route
              path="/Commande"
              element={
                <PrivateRoute>
                  <Commande />
                </PrivateRoute>
              }
            />
            <Route
              path="/MyCommande"
              element={
                <PrivateRoute>
                  <MyCommande />
                </PrivateRoute>
              }
            />
            <Route
              path="/Contact_utilisateur"
              element={
                <PrivateRoute>
                  <Contactuser />
                </PrivateRoute>
              }
            />

            {/* Pages admin privées */}
            <Route
              path="/admin-accueil"
              element={
                <PrivateRoute adminOnly={true}>
                  <A_accueil />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin-catalogue"
              element={
                <PrivateRoute adminOnly={true}>
                  <A_catalogue />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin-commande"
              element={
                <PrivateRoute adminOnly={true}>
                  <A_Commande />
                </PrivateRoute>
              }
            />

            <Route
              path="/admin-messages"
              element={
                <PrivateRoute adminOnly={true}>
                  <A_Message />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
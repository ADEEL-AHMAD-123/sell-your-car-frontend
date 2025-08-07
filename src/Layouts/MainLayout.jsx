// src/Layouts/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import './MainLayout.scss'; 

const MainLayout = () => {
  return (

    <div className="main-layout-container">
      <Header />
      
      <main className="main-content-wrapper">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;

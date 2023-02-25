import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './Pages/LoginPage/LoginPage';
import RegisterPage from './Pages/RegisterPage/RegisterPage';


const Main = () => {
  return (
    <Routes> {/* The Switch decides which component to show based on the current URL.*/}
      <Route path='/' element={<LoginPage/>}></Route>
      <Route path='/register' element={<RegisterPage/>}></Route>
    </Routes>
  );
}


export default Main;
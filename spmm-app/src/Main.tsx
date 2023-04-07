import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './Pages/LoginPage/LoginPage';
import MigrationRequestsHistoryPage from './Pages/MigrationRequestsHistoryPage/MigrationRequestsHistoryPage';
import MigrationRequestsPage from './Pages/MigrationRequestsPage/MigrationRequestsPage';
import RegisterPage from './Pages/RegisterPage/RegisterPage';
import ViewRequestPage from './Pages/ViewRequestPage/ViewRequestPage';
import NewEditRequestPagePage from './Pages/NewEditRequestPage/NewEditRequestPage';


const Main = () => {
  return (
    <Routes> {/* The Switch decides which component to show based on the current URL.*/}
      <Route path='/' element={<LoginPage/>}></Route>
      <Route path='/register' element={<RegisterPage/>}></Route>
      <Route path='/migrationRequests' element={<MigrationRequestsPage/>}></Route>
      <Route path='/migrationRequestsHistory' element={<MigrationRequestsHistoryPage/>}></Route>
      <Route path='/viewRequest/:id' element={<ViewRequestPage/>}></Route>
      <Route path='/createRequest' element={<NewEditRequestPagePage/>}></Route>
      <Route path='/editRequest/:id' element={<NewEditRequestPagePage/>}></Route>

    </Routes>
  );
}


export default Main;
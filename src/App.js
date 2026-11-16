import './App.css';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Loader from './Components/Loader';


const LazyHome = React.lazy(()=>import ('./Components/Home'))
const LazyUserdashboard = React.lazy(()=>import('./Components/UserDashboard'))
const LazyOrphanageadmin = React.lazy(()=>import('./Components/Orphanageadmin'))
const LazySignup = React.lazy(()=>import('./Components/Signup'))
const LazyLogin = React.lazy(()=>import('./Components/Login'))

function App() {
  return (
    <div className="App">
      <Navbar/>
      <Routes>
        <Route path='/' element={<React.Suspense fallback={<Loader/>}><LazyHome/></React.Suspense>}/>
        <Route path='/orphanageadmin/:id' element={<React.Suspense fallback={<Loader/>}><LazyOrphanageadmin/></React.Suspense>}/>
        <Route path='/userdashboard' element={<React.Suspense fallback={<Loader/>}><LazyUserdashboard/></React.Suspense>}/>
        <Route path='/signup' element={<React.Suspense fallback={<Loader/>}><LazySignup/></React.Suspense>}/>
        <Route path ='/login' element={<React.Suspense fallback={<Loader/>}><LazyLogin/></React.Suspense>}/>
      </Routes>
    </div>
  );
}

export default App;

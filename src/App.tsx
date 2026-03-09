


import AdminLogin from './pages/admin/AdminLogin'

import Dashboard from './pages/admin/Dashboard';
import { Route, Routes } from 'react-router-dom';
import AdminRegister from './pages/admin/AdminRegister';
import Reservations from './pages/admin/Reservation';
import Rooms from './pages/admin/Rooms';



import ClientLayout from './pages/guest/ClientLayout';
import FrontDesk from './pages/admin/FronteDesk';
import Reports from './pages/admin/Reports';
import Accounts from './pages/admin/Accounts';


function App() {
  

  return (
    <>

<Routes>
  <Route path='/register' element={<AdminRegister/>}/>
  <Route path='/login' element = {<AdminLogin/>} />
  <Route path='/dashboard/home' element= {<Dashboard/>} />
  <Route path='/dashboard/reservations' element={<Reservations/>}/>
  <Route path='/dashboard/rooms' element={<Rooms/>}/>

   <Route path='/dashboard/rooms' element={<Rooms/>}/>

    <Route path='/dashboard/frontdesk' element={<FrontDesk/>}/>

    <Route path='/dashboard/reports' element={<Reports/>}/>

     <Route path='/dashboard/accounts' element={<Accounts/>}/>


  {/* client routes */}

      
          <Route path="/" element={<ClientLayout />} />
         


  
</Routes>
 
    </>
  )
}

export default App

import 'bootstrap/dist/css/bootstrap.min.css';

import { Route, Routes } from 'react-router-dom';

import { AuthContext } from './context/AuthContext';
import { Protected } from './components/Protected';

import HomeP from './components/HomeP';
import LoginP from './components/LoginP';
import Plans from './components/Plans';
import Register from './components/Register';
import Cards from './components/Cards';
import PlanDetail from './components/PlanDetail';
import MainPage from './components/MainPage';
import Canvas from './components/Canvas';


function App() {
  return (
      <AuthContext>
        <Routes>
          <Route path='/' element={<HomeP />} />
          <Route path='login' element={<LoginP />} />
          <Route path='register' element={<Register/>}/>
          <Route path='cards' element={<Cards/>}/>

          <Route path='ip' element={<MainPage/>}>
            <Route index element={<Plans/>} />
            <Route path='plans' element={<Protected><Plans /></Protected>} />
            <Route path='plandetails/:planId' element={<Protected><PlanDetail /></Protected>}/> 
            <Route path='canvas/:planId/:projectIndex' element={<Protected><Canvas /></Protected>}/> 
          </Route>
          
          
          <Route path='*' element={<div><h2 className="text-center mt-5">Sorry, couldn't find the page you were looking for.</h2></div>} />
        </Routes>
      </AuthContext>
  );
}


export default App;
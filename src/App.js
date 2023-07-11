import { useState } from 'react';
import './App.css';
import Canvas from './Canvas';
import * as Icons from '@mui/icons-material';

function App() {
  return (
    <div className="App">
      <Canvas />

      <p>
        <a href="https://www.freepik.com/free-psd/living-room-wall-psd-japandi-interior_16216036.htm#query=interior%20mockup&position=1&from_view=search&track=ais">
          Image by rawpixel.com
        </a>{' '}
        on Freepik
      </p>
    </div>
  );
}

export default App;

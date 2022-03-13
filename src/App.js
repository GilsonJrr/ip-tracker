import React, {useState, useEffect} from 'react';
import 'leaflet/dist/leaflet.css';
import './App.css';
import Arrow from './img/icon-arrow.svg'
import api from './App/API';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from "leaflet";
import 'bootstrap/dist/css/bootstrap.min.css';
import Spinner from 'react-bootstrap/Spinner'

function App() {

  const[data, setData] = useState()
  const[ip, setIP] = useState('')
  const[ipNumber, setIpNumber] = useState('')
  const[loading, setLoading] = useState(true)
  const[position, setPosition] = useState([])
  const[latLong, setLatLong] = useState([])

  function GetIcon() {
    return L.icon({
      iconUrl: require("./img/icon-location.png"),
      iconSize: 50,
    });
  }

  useEffect(() => {

    async function CallData(){
      await api
      .get("v2/country,city?apiKey=at_CAVHz31La5XSme4sO4IBOWpbobQnB&ipAddress="+ipNumber)
      .then((response) => setData(response.data))
      .catch((err) => {
        console.error("ops! ocorreu um erro" + err);
      });
    }

    // setLatLong([data?.location.lat, data?.location.lng])
    setPosition([48.86696457626759, 2.33845037412616])
    
      if(position != ''){
        setTimeout(() => {
          setLoading(false)
        }, 2000);
      }
      
  });

  function HandleIP(){
    setIpNumber(ip)
    setLoading(true)
    setLatLong([40.42898475978098, -3.7070096998396393])
  }

  return (
    <div className='App'>

      <div className='Top'>
        <p1>IP Address Tracker</p1>

        <div className='Search'> 
          <div className='Input'>
            <input placeholder='Search for any IP or Domain' value={ip} 
            onChange={(e)=> setIP(e.target.value) }/>
          </div>
          <div className='Arow' onClick={HandleIP}>
            <img src={Arrow}/>
          </div>
        </div>
      </div>

      {loading ?
      <div className='Loading'>
        <Spinner animation="border" variant="dark" />
      </div>
      :
      <div className='Map'>
        <MapContainer center={position} zoom={13} className='Map' >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position} icon={GetIcon()}>
            <Popup>
              Nome do Lugar
            </Popup>
          </Marker>
        </MapContainer>
      </div>}
      
      { loading ?
        <div className='Info'>
          <div className='LoadingInfo'>
            <Spinner animation="border" variant="dark" />
          </div>
        </div>
        :
      <div className='Info'>
        <div className='InfoTitles'>
          <p1>IP ADDRESS</p1>
          <p2>{data?.ip}</p2>
          {/* <p2>8.8.8.8</p2> */}
        </div>
        <div className='Line'/>
        <div className='InfoTitles'>
          <p1>LOCATION</p1>
          <p2>{data?.location.region}, {data?.location.country} {data?.as.asn}</p2>
          {/* <p2>Brooklyn, NY 10001</p2> */}
        </div>
        <div className='Line'/>
        <div className='InfoTitles'>
          <p1>TIMEZONE</p1>
          <p2>UTC{data?.location.timezone}</p2>
          {/* <p2>UTC - 05:00</p2> */}
        </div>
        <div className='Line'/>
        <div className='InfoTitles'>
          <p1>ISP</p1>
          <p2>{data?.isp}</p2>
          {/* <p2>SpaceX Starlink</p2> */}
        </div>
      </div>}

    </div>
  );
}

export default App;

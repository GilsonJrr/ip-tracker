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

  const[loading, setLoading] = useState(false)
  const[loadingMap, setLoadingMap] = useState(true)
  const[empty, setEmpty] = useState(false)

  let position = ([0,0])
  let ipNumber = ('')

  function GetIcon() {
    return L.icon({
      iconUrl: require("./img/icon-location.png"),
      iconSize: 50,
    });
  }


  // First API call
  useEffect(() => {

      async function LoadAPI(){
        await api
          .get("country,city?apiKey=at_Z4vp3JFIVIoXWIxQbJ4HjGLcLQAKY&ipAddress="+ipNumber)
          .then((response) => setData(response.data))
          .catch((err) => {
            console.error("ops! ocorreu um erro" + err);
          });
      }
      LoadAPI();
      
  },[]);

  // Api call refresh
  const refresh = () => {

      setEmpty(false)
      ipNumber = (ip)
    
      setLoadingMap(true)
      setLoading(true)
  
      async function LoadAPI(){
        await api
          .get("country,city?apiKey=at_Z4vp3JFIVIoXWIxQbJ4HjGLcLQAKY&ipAddress="+ipNumber)
          .then((response) => setData(response.data))
          .catch((err) => {
            console.error("ops! ocorreu um erro" + err);
            setEmpty(true)
          });
      }
  
      LoadAPI();
  
      position = ([data?.location.lat, data?.location.lng]);

      setTimeout(()=>{
        setLoading(false)
      },3000)
    
  };

  useEffect(refresh, []);

    position = ([data?.location.lat, data?.location.lng]);
    setTimeout(()=>{
      setLoadingMap(false)
    },3000)
  
  return (
    <div className='App'>

      <div className='Top'>
        <p1>IP Address Tracker</p1>

        <div className='Search'> 
          <div className='Input'>
            <input placeholder='Search for any IP or Domain' value={ip} 
            onChange={(e)=> setIP(e.target.value) }/>
          </div>
          <div className='Arow' onClick={refresh}>
            <img src={Arrow}/>
          </div>
        </div>
      </div>

      {loadingMap?
      <div className='Loading'>
        <Spinner animation="border" variant="dark" />
      </div>
      :
      <div className='Map'>
        <MapContainer center={position} zoom={13} className='Map' zoomControl={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position} icon={GetIcon()}>
            <Popup>
            {data?.isp}
            </Popup>
          </Marker>
        </MapContainer>
      </div>}

      { loading ?
        <div className='InfoEmpty'>
          <div className='LoadingInfo'>
            <Spinner animation="border" variant="dark" />
          </div>
        </div>
      :
      <div className='Info'>
        <div className='InfoTitles'>
          <div className='InfoText'>
            <p1>IP ADDRESS</p1>
            {/* <p2>{data?.query}</p2> */}
            <p2>{data?.ip}</p2>
            {/* <p2>8.8.8.8</p2> */}
          </div>
        </div>
        
        <div className='InfoTitles'>
          <div className='Line'/>
          <div className='InfoText'>
            <p1>LOCATION</p1>
            <p2>{data?.location.region}, {data?.location.country} {data?.as.asn}</p2>
            {/* <p2>{data?.region}, {data?.country} {data?.zip}</p2> */}
            {/* <p2>Brooklyn, NY 10001</p2> */}
          </div>
        </div>
        <div className='InfoTitles'>
          <div className='Line'/>
          <div className='InfoText'>
            <p1>TIMEZONE</p1>
            <p2>UTC{data?.location.timezone}</p2>
            {/* <p2>{data?.timezone}</p2> */}
            {/* <p2>UTC - 05:00</p2> */}
          </div>
        </div>
        <div className='InfoTitles'>
          <div className='Line'/>
          <div className='InfoText'>
            <p1>ISP</p1>
            <p2>{data?.isp}</p2>
            {/* <p2>SpaceX Starlink</p2> */}
          </div>
        </div>
      </div>}

      {empty &&
        <div className='InfoEmpty'>
          <div className='LoadingInfo'>
            <p2>IP or Domain not found</p2>
          </div>
        </div>
      }

    </div>
  );
}

export default App;

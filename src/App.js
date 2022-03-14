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

  const[loading, setLoading] = useState(true)
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

  useEffect(() => {

      async function LoadAPI(){
        const response = await api.get("json/"+ipNumber);
        setData(response.data);
        console.log(data)
        setLoading(false);
      }
      LoadAPI();
      
  },[]);

  const refresh = () => {

      setEmpty(false)
      ipNumber = (ip)
    
      setLoadingMap(true)
      setLoading(true)
  
      async function LoadAPI(){
        const response = await api.get("json/"+ipNumber);
        setData(response.data);
        console.log(data)
      }
  
      LoadAPI();
  
      position = ([data?.lat, data?.lon]);
      setTimeout(()=>{
        setLoading(false)
      },500)
    
  };

  useEffect(refresh, []);

  if(data?.status === 'success'){
    position = ([data?.lat, data?.lon]);
    setTimeout(()=>{
      setLoadingMap(false)
    },500)
  }

  function Error(){
    if(data?.status === 'fail'){
      setData('')
      setEmpty(true)
      setLoading(true)
      setLoadingMap(true)
    }
  }

  Error()
  
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
          <p2>{data?.query}</p2>
          {/* <p2>{data?.ip}</p2> */}
          {/* <p2>8.8.8.8</p2> */}
        </div>
        <div className='Line'/>
        <div className='InfoTitles'>
          <p1>LOCATION</p1>
          {/* <p2>{data?.location.region}, {data?.location.country} {data?.as.asn}</p2> */}
          <p2>{data?.region}, {data?.country} {data?.zip}</p2>
          {/* <p2>Brooklyn, NY 10001</p2> */}
        </div>
        <div className='Line'/>
        <div className='InfoTitles'>
          <p1>TIMEZONE</p1>
          {/* <p2>UTC{data?.location.timezone}</p2> */}
          <p2>{data?.timezone}</p2>
          {/* <p2>UTC - 05:00</p2> */}
        </div>
        <div className='Line'/>
        <div className='InfoTitles'>
          <p1>ISP</p1>
          <p2>{data?.isp}</p2>
          {/* <p2>SpaceX Starlink</p2> */}
        </div>
      </div>}

      {empty &&
        <div className='Info'>
          <div className='LoadingInfo'>
            <p2>IP or Domain not found</p2>
          </div>
        </div>
      }

    </div>
  );
}

export default App;

import './style.css'


let main = document.getElementById('app');
let listDiv = document.createElement('div');
listDiv.id = 'listContainer';
let listUl = document.createElement('ul');
listUl.id = 'listUl';

main.appendChild(listDiv);
listDiv.appendChild(listUl);

function printDht11SensorData() {
  listUl.innerHTML = "";
  
  fetch(`http://localhost:8080/get-all-dht11-sensor-data`)
   .then(response => response.json())
   .then(data => {
    console.log(data);
    data.forEach(singleReading => {
      let listItem = document.createElement('li');
      
      let timeStampString = singleReading.timeStamp.toString();
      let date = timeStampString.substring(0, 10);
      let time = timeStampString.substring(11, 16);
      listItem.innerHTML = `Date: ${date} | Time: ${time} | Temperature: ${singleReading.celsius}°C | Humidity: ${singleReading.humidity}%`;
      listUl.appendChild(listItem);
    });
   });  
  }

  // function refreshDatabase() {
  //   setInterval(() => {
  //     printDht11SensorData();
  //   }, 60000); 
  // }
  // refreshDatabase();


  printDht11SensorData();




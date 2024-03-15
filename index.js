// https://api.openweathermap.org/data/2.5/weather?lat=25.317644&lon=82.973915&appid=a7e8e38befe44abc0902f59c0d94ad8d
//font awesome se sun moon ka photo in html , cdn link diwnloade karna

// ! likhne se basic

const http = require('http');
const fs= require('fs');
// aaj request method use instead of routing
var requests = require("requests"); //not core modulus so installed and required

const homeFile=fs.readFileSync("home.html" , "utf-8");

const replaceval = ( tempval , orgval)=>{
  let temperature = tempval.replace(/{%tempval%}/g, (orgval.main.temp - 273.15).toFixed(1));
  temperature = temperature.replace(/{%tempmin%}/g, (orgval.main.temp_min - 273.15).toFixed(1));
  temperature = temperature.replace(/{%tempmax%}/g, (orgval.main.temp_max - 273.15).toFixed(1));
  temperature = temperature.replace(/{%location%}/g, orgval.name);
  temperature = temperature.replace(/{%country%}/g, orgval.sys.country);
  temperature = temperature.replace(/{%tempstatus%}/g, orgval.weather.main);
  return temperature;
};


const server = http.createServer((req, res) => {
   if (req.url === "/") { //streaming
      requests(
        "https://api.openweathermap.org/data/2.5/weather?lat=25.317644&lon=82.973915&appid=a7e8e38befe44abc0902f59c0d94ad8d"
      )
      .on("data", (chunk) => {
          const  objdata =JSON.parse(chunk);
          const arrData = [objdata];
          //console.log(arrData[0].main.temp);
          const realTimeData = arrData.map((val ) =>{
            //console.log(val);
            return replaceval(homeFile, val); //function to replae upar band h
          }).join(''); //html data ko api data se repplace
          res.write(realTimeData);
          //console.log(realTimeData);
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to error", err);
        res.end();
      });
    }
});

// npm init karke json file create

server.listen(8000 , "127.0.0.1" );

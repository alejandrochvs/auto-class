var soap = require('soap');
var url = 'http://www.webservicex.com/globalweather.asmx?wsdl';
var args = {name: 'value'};
soap.createClient(url, function(err, client) {
    console.log(client.GlobalWeather.GlobalWeatherSoap.GetWeather((err,res,raw,soapHeader)=>{
        console.log(err,res,raw,soapHeader);
    }));
});
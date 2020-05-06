
import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Button, FlatList, Text, Keyboard } from 'react-native';
import PrevisaoItem from './components/PrevisaoItem';
import _ from 'lodash';

export default function App() {
  const endpointCity = "https://api.openweathermap.org/data/2.5/forecast?lang=pt_br&units=metric&q=";
  const endpointTempo = "https://api.openweathermap.org/data/2.5/onecall?lat=";
  const pointLon = "&lon="
  const excludeAndApi = "&exclude=hourly,daily&appid="

  const apiKey = '8fd1995638f967905de3f3ac441a7973';

  const[cidade, setCidade] = useState('');
  const[dadosJson, setDadosJson] = useState({});
  const[dadosJson2, setDadosJson2] = useState({});

  const[feelsLike, setFeelsLike] = useState('')
  const[sunrise, setSunrise] = useState('')
  const[sunset, setSunset] = useState('')
  const[icon, setIcon] = useState('')

  const capturarCidade = (cidade) => {
    setCidade(cidade)
  }

  const obtemLatLon = () => {
    setDadosJson({});
    const target = endpointCity + cidade + "&appid=" + apiKey;
    var lon, lat;
    console.log(target)
    fetch(target)
    .then(dados => dados.json())
    .then((dados) => {
      setDadosJson(dados["city"])
        lon = dadosJson.coord.lon;
        lat = dadosJson.coord.lat;
        console.log(lon, lat)
       endpointBuscaNovaApi(lon, lat)
      Keyboard.dismiss();
    })
  }

  const endpointBuscaNovaApi = (lon, lat) => {
    setDadosJson2({})
    const target = endpointTempo + lat + pointLon + lon + excludeAndApi + apiKey;
    console.log(target)
    fetch(target)
    .then(dados => dados.json())
    .then((dados) => {
      setDadosJson2(dados["current"])
      setFeelsLike(dadosJson2.feels_like.toString())
      setSunrise(dadosJson2.sunrise.toString())
      setSunset(dadosJson2.sunset.toString())
      setIcon(dadosJson2.weather[0].icon.toString())
      Keyboard.dismiss();
    })
  }
  
  
  return (
    <View style={styles.container}>
      <View style={styles.entrada}>
        <TextInput
          style={styles.nomeCidade}
          placeholder="Nome da Cidade"
          onChangeText={capturarCidade}
          value={cidade}
        />
        <Button
          title="Ok"
          onPress={obtemLatLon}
        />
      </View>
      <PrevisaoItem feelsLike={feelsLike} sunrise={sunrise} sunset={sunset} icon={icon}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  entrada: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  nomeCidade: {
    padding: 5,
    borderBottomColor: '#BB96F3',
    borderBottomWidth: 2,
    textAlign: 'left',
    flexGrow: 0.9
  }
});
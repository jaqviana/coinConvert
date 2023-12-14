import { useState, useEffect } from "react"; //para armazenar algo
import { View, Text, StyleSheet, ActivityIndicator, TextInput, TouchableOpacity, Keyboard } from 'react-native';
 
import { PickerItem } from './src/Picker/'

//como chamammos de index nao precisa da barra index e como demos apenas um export no component (n colocamos default) entao pegamos dentro de chaves

//import { api } from './src/api';
import { api } from './src/servicos/api'


export default function App(){
  const[loading, setLoading] = useState(true);
  const [coin, setCoin] = useState([]) //colocar dentro do useState pra tornar dinamico, vai comecar um array vazio 
  const [selectedCoin, setSelectedCoin] = useState(null)//null sem nenhuma selecionada
  const [coinBValue, setCoinBValue] = useState("")//armazena o valor que queremos converter

  const [valueCoin, setValueCoin] = useState(null)
  const [convertedValue, setConvertedValue] = useState (0)
  
 

  useEffect(() => {
    async function loadCoin(){ //para buscar algo externo no caso http
      const response = await api.get("all")
      let arrayCoin = []; //criar uma array para colocar todas as propriedades do nosso objeto q ta dentro das {} na api, para conseguir mapear e aparecer na nossa lista
      Object.keys(response.data).map((key) => { //Object.keys para acessa cada chave (cada moeda da api) o map e pra percorrer elas
        arrayCoin.push ({//pra colocar algo dentro do nosso array
          key: key,
          lable: key,
          value: key,
        }) 
      }) 
   
      setCoin(arrayCoin)
      setSelectedCoin(arrayCoin[0].key)
      setLoading(false);
   
    }

    loadCoin(); //chamdo ela pra ser executada

  }, []) //array vazio significa que qdo o coponente for mmntado vai chamar o q tiver dentro do useEffect

  async function convert (){ //async por cause do await q tem na function
    if(coinBValue === 0 || coinBValue === "" || selectedCoin === null){
      return;
      }
      
      const response = await api.get(`/all/${selectedCoin}-BRL`)
      console.log(response.data[selectedCoin].ask);

      let result = (response.data[selectedCoin].ask * parseFloat(coinBValue)) 

      setConvertedValue (`${result.toLocaleString("pt-BR", {style: "currency", currency: "BRL"})}`)
      setValueCoin(coinBValue)
      
      Keyboard.dismiss();
    }

    
  

  if(loading){
    return(
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#101215' }}>
        <ActivityIndicator color="#FFF" size="large"/>
      </View>
    )
  }

  return(

    <View style={styles.container}>
      <View style={styles.areaCoin}>
      <Text style={styles.title}>Select the coin</Text>
      <PickerItem
        coin={coin}
        selectedCoin={selectedCoin}
        onChange={(coin) => setSelectedCoin(coin)}
      />
    </View>

    <View style={styles.areaValor}>
      <Text style={styles.title} >Typing a value to convert in (R$)</Text>
      <TextInput
        placeholder="e.g: 1.50"
        style={styles.input}
        keyboardType="numeric"
        value={coinBValue}
        onChangeText={ (value) => setCoinBValue(value)}
      />
    </View>

    <TouchableOpacity style={styles.btnArea} onPress={convert}>
      <Text style={styles.btnText}>Convert</Text>
    </TouchableOpacity>

    {convertedValue !== 0 && (  //se convertedValue for diferente de zero entao mostra a view
    <View  style={styles.areaResult}>
      <Text style={styles.valueConverted}>
        {valueCoin} {selectedCoin}
      </Text>
  
      <Text style={{fontSize: 18, margin: 8, color: '#000'}}>
        value 
      </Text>
  
      <Text style={styles.valueConverted}>
       {convertedValue}
      </Text>
    </View>
    )}
      
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1, //pega a tela inteira do app
    backgroundColor: '#101215',
    paddingTop: 40, //espacamento interno pra desgrudar da topbar
    alignItems: 'center', //para centralizar tdo q tiver aqui dentro desse container
  },
  areaCoin:{
    backgroundColor: '#f9f9f9',
    width: '90%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    padding: 8,
    marginBottom: 1 //espacamento interno
  },
  title:{
    fontSize: 16,
    color: "#000",
    fontWeight: '500',
    paddingLeft: 5,
    paddingTop: 5,
  },
  areaValor:{
    width: '90%',
    backgroundColor: "#f9f9f9",
    paddingTop: 8,
    paddingBottom: 8,
  },
  input:{
    width: '100%',
    padding: 8,
    fontSize: 18,
    color: "#000",
  },
  btnArea:{
   width: '90%',
   backgroundColor: "#fb4b57",
   height: 45,
   alignItems: 'center', //para centralizar horizontal - estou usando o flexbox para
   justifyContent:'center', //para centralizar vertical
   borderBottomLeftRadius: 8,
   borderBottomRightRadius: 8
  },
  btnText:{
   color: "#000",
   fontWeight: 'bold',
   fontSize: 16,
  },
  areaResult:{
    width: '90%',
    backgroundColor: '#FFF',
    marginTop: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24',
  },
  valueConverted: {
    fontSize: 28,
    color: "#000",
    fontWeight: "bold"
  }
  
})
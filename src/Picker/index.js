
import { View } from 'react-native';
import { Picker } from '@react-native-picker/picker'

export function PickerItem(props){ //como nao colcoamos o default na hr de importar tem q ser dentro de {}
    
    let coinItem =  props.coin.map((item, index) => {
        return <Picker.Item value={item.key} key={index} label={item.key} />
    })
    
    return(
        <Picker
        selectedValue={props.selectedCoin}
        onValueChange={(value) => props.onChange(value)}
        >
            {coinItem}
        </Picker>
    )
}
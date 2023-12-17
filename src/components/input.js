import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
const Input = ({label, iconName, error, password, ...props}) => {
  const [hidePassword, setHidePassword] = React.useState(password);
  return (
    <View style={{marginBottom: 19, borderRadius: 10, height: 50}}>
      <View
        style={[
          style.inputContainer,
          {
            borderColor: error ? 'red' : '#C5C5C5',
            alignItems: 'center',
          },
        ]}>
        <TextInput
          secureTextEntry={hidePassword}
          style={{color: '#000', flex: 1, fontSize: 16, paddingVertical: 7}}
          {...props}
        />
        <Icon
          name={iconName}
          style={{color: '#000', fontSize: 16, marginRight: 5}}
          {...props}
        />
      </View>
      {error && <Text style={{color: 'red', fontSize: 12}}> {error}</Text>}
    </View>
  );
};

const style = StyleSheet.create({
  label: {
    marginVertical: 5,
    fontSize: 14,
    color: '#F3F4FB',
  },
  inputContainer: {
    height: 47,
    flexDirection: 'row',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#C5C5C5',
  },
});

export default Input;

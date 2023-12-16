import {Text} from 'react-native';
import React from 'react';
import NumberFormat from 'react-number-format';

export default function FormatNumber({number}) {
  return (
    <NumberFormat
      value={parseInt(number)}
      displayType="text"
      thousandSeparator
      suffix="đ"
      renderText={value => <Text style={{color: 'black'}}>{value}</Text>}
    />
  );
}

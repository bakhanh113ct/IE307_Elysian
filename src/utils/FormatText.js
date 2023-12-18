import {View, Text} from 'react-native';
import React from 'react';

const FormatText = ({title, content}) => {
  return (
    <Text>
      {title}{' '}
      <Text style={{color: 'black', fontWeight: '500'}}> {content}</Text>
    </Text>
  );
};

export default FormatText;

import React from 'react';
import { TouchableOpacity, Image, Text, View, StyleSheet } from 'react-native';
import { artwork } from '../api';
import { THEME } from '../config';

export default function PokemonCard({ id, name, onPress }) {
  return (
    <TouchableOpacity style={s.card} onPress={onPress} activeOpacity={0.8}>
      <Image source={{ uri: artwork(id) }} style={s.img} />
      <View>
        <Text style={s.num}>#{String(id).padStart(4, '0')}</Text>
        <Text style={s.name}>{name}</Text>
      </View>
    </TouchableOpacity>
  );
}
const s = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: THEME.card, borderRadius: 16, padding: 10, marginHorizontal: 14, marginVertical: 5, borderLeftWidth: 6, borderLeftColor: THEME.accent },
  img: { width: 70, height: 70, marginRight: 14 },
  num: { color: THEME.main, fontWeight: '700' },
  name: { fontSize: 18, fontWeight: '600', color: THEME.text, textTransform: 'capitalize' },
});

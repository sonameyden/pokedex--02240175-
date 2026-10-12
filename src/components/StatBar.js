import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME } from '../config';

export default function StatBar({ label, value, max = 255 }) {
  return (
    <View style={s.row}>
      <Text style={s.label}>{label}</Text>
      <Text style={s.val}>{value}</Text>
      <View style={s.track}>
        <View style={[s.fill, { width: `${Math.min(100, (value / max) * 100)}%` }]} />
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  label: { width: 110, color: THEME.text, textTransform: 'capitalize' },
  val: { width: 40, fontWeight: '700', color: THEME.text },
  track: { flex: 1, height: 10, borderRadius: 5, backgroundColor: '#ddd6fe' },
  fill: { height: 10, borderRadius: 5, backgroundColor: THEME.main },
});

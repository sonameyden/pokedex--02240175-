import React, { useEffect, useState, useCallback } from 'react';
import { ScrollView, View, Text, Image, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { fetchDetail, artwork } from '../api';
import { THEME } from '../config';
import { useTeam } from '../TeamContext';
import StatBar from '../components/StatBar';

export default function DetailScreen({ route, navigation }) {
  const { id } = route.params;
  const { has, isFull, add, remove } = useTeam();
  const [p, setP] = useState(null);
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    setError(null);
    fetchDetail(id)
      .then((d) => { setP(d); navigation.setOptions({ title: d.name }); })
      .catch(() => setError('Could not load details.'));
  }, [id]);
  useEffect(() => { load(); }, [load]);

  if (error) return <View style={s.center}><Text style={s.err}>{error}</Text><TouchableOpacity style={s.btn} onPress={load}><Text style={s.btnTxt}>Retry</Text></TouchableOpacity></View>;
  if (!p) return <ActivityIndicator style={{ flex: 1 }} size="large" color={THEME.main} />;

  const inTeam = has(p.id);
  const disabled = !inTeam && isFull;
  return (
    <ScrollView style={{ backgroundColor: THEME.bg }} contentContainerStyle={s.wrap}>
      <Image source={{ uri: artwork(p.id) }} style={s.img} />
      <Text style={s.name}>{p.name}</Text>
      <View style={s.types}>{p.types.map((t) => <Text key={t} style={s.type}>{t}</Text>)}</View>
      <Text style={s.meta}>Height: {p.height} m   ·   Weight: {p.weight} kg</Text>
      <View style={{ alignSelf: 'stretch', marginVertical: 14 }}>
        {p.stats.map((st) => <StatBar key={st.name} label={st.name} value={st.value} />)}
      </View>
      <TouchableOpacity
        disabled={disabled}
        style={[s.btn, inTeam && { backgroundColor: '#dc2626' }, disabled && { backgroundColor: '#9ca3af' }]}
        onPress={() => (inTeam ? remove(p.id) : add({ id: p.id, name: p.name, stats: p.stats }))}>
        <Text style={s.btnTxt}>{inTeam ? 'Remove from team' : disabled ? 'Team is full (6/6)' : 'Add to team'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
const s = StyleSheet.create({
  wrap: { alignItems: 'center', padding: 20 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  img: { width: 220, height: 220 },
  name: { fontSize: 28, fontWeight: '800', color: THEME.text, textTransform: 'capitalize' },
  types: { flexDirection: 'row', marginVertical: 8 },
  type: { backgroundColor: THEME.accent, color: '#fff', fontWeight: '700', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginHorizontal: 4, textTransform: 'capitalize' },
  meta: { color: THEME.text },
  err: { color: '#b91c1c', marginBottom: 10 },
  btn: { backgroundColor: THEME.main, paddingHorizontal: 26, paddingVertical: 12, borderRadius: 24 },
  btnTxt: { color: '#fff', fontWeight: '700' },
});

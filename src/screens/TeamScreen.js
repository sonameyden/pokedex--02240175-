import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useTeam } from '../TeamContext';
import { THEME, MAX_TEAM } from '../config';
import PokemonCard from '../components/PokemonCard';
import StatBar from '../components/StatBar';

export default function TeamScreen({ navigation }) {
  const { team, remove } = useTeam();
  const totals = {};
  team.forEach((p) => p.stats.forEach((st) => { totals[st.name] = (totals[st.name] || 0) + st.value; }));
  const names = Object.keys(totals);

  return (
    <View style={s.wrap}>
      <Text style={s.count}>{team.length}/{MAX_TEAM} members</Text>
      <FlatList
        data={team}
        keyExtractor={(p) => String(p.id)}
        ListEmptyComponent={<Text style={s.empty}>Your team is empty. Open a Pokémon and add it!</Text>}
        renderItem={({ item }) => (
          <View>
            <PokemonCard id={item.id} name={item.name} onPress={() => navigation.navigate('Detail', { id: item.id })} />
            <TouchableOpacity onPress={() => remove(item.id)} style={s.rm}><Text style={s.rmTxt}>Remove</Text></TouchableOpacity>
          </View>
        )}
        ListFooterComponent={names.length ? (
          <View style={s.totals}>
            <Text style={s.h}>Combined base stats</Text>
            {names.map((n) => <StatBar key={n} label={n} value={totals[n]} max={255 * MAX_TEAM} />)}
          </View>
        ) : null}
      />
    </View>
  );
}
const s = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: THEME.bg },
  count: { fontSize: 22, fontWeight: '800', color: THEME.main, margin: 14 },
  empty: { textAlign: 'center', marginTop: 40, color: THEME.text },
  rm: { position: 'absolute', right: 26, top: 30 },
  rmTxt: { color: '#dc2626', fontWeight: '700' },
  totals: { margin: 14, padding: 14, backgroundColor: '#fff', borderRadius: 16 },
  h: { fontWeight: '800', color: THEME.text, marginBottom: 6 },
});

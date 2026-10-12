import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { fetchPage, fetchAllNames } from '../api';
import { START_OFFSET, THEME } from '../config';
import PokemonCard from '../components/PokemonCard';

const Retry = ({ msg, onPress }) => (
  <View style={s.center}>
    <Text style={s.err}>{msg}</Text>
    <TouchableOpacity style={s.btn} onPress={onPress}><Text style={s.btnTxt}>Retry</Text></TouchableOpacity>
  </View>
);

export default function PokedexScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const offset = useRef(START_OFFSET);
  const busy = useRef(false);

  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [allNames, setAllNames] = useState(null);
  const [searchError, setSearchError] = useState(null);

  const loadMore = useCallback(async () => {
    if (busy.current || !hasMore) return;
    busy.current = true;
    setLoading(true);
    setError(null);
    try {
      const page = await fetchPage(offset.current);
      offset.current += page.items.length;
      setItems((prev) => {
        const seen = new Set(prev.map((p) => p.id));
        return [...prev, ...page.items.filter((p) => !seen.has(p.id))];
      });
      setHasMore(page.hasMore);
    } catch (e) {
      setError('Could not load Pokémon. Check your internet connection.');
    } finally {
      busy.current = false;
      setLoading(false);
    }
  }, [hasMore]);

  const loadNames = useCallback(() => {
    setSearchError(null);
    fetchAllNames().then(setAllNames).catch(() => setSearchError('Search failed. Check your connection.'));
  }, []);

  useEffect(() => { loadMore(); }, []);
  // debounce: wait 400ms after the last keystroke
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim().toLowerCase()), 400);
    return () => clearTimeout(t);
  }, [query]);
  useEffect(() => { if (debounced && !allNames) loadNames(); }, [debounced]);

  const searching = debounced.length > 0;
  const results = searching && allNames ? allNames.filter((p) => p.name.includes(debounced)).slice(0, 60) : null;
  const data = searching ? results || [] : items;

  let body;
  if (searching && searchError) body = <Retry msg={searchError} onPress={loadNames} />;
  else if (searching && !allNames) body = <ActivityIndicator style={{ marginTop: 40 }} size="large" color={THEME.main} />;
  else if (!searching && error && items.length === 0) body = <Retry msg={error} onPress={loadMore} />;
  else if (!searching && loading && items.length === 0) body = <ActivityIndicator style={{ marginTop: 40 }} size="large" color={THEME.main} />;
  else body = (
    <FlatList
      data={data}
      keyExtractor={(p) => String(p.id)}
      renderItem={({ item }) => <PokemonCard id={item.id} name={item.name} onPress={() => navigation.navigate('Detail', { id: item.id })} />}
      onEndReached={searching ? undefined : loadMore}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={searching ? <Text style={s.empty}>No Pokémon found for "{debounced}".</Text> : null}
      ListFooterComponent={
        !searching && loading ? <ActivityIndicator style={{ margin: 16 }} color={THEME.main} />
        : !searching && error ? <Retry msg={error} onPress={loadMore} /> : null
      }
    />
  );

  return (
    <View style={s.wrap}>
      <TextInput style={s.input} placeholder="Search all Pokémon by name…" value={query} onChangeText={setQuery} autoCapitalize="none" autoCorrect={false} />
      {body}
    </View>
  );
}
const s = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: THEME.bg },
  input: { backgroundColor: '#fff', margin: 14, padding: 12, borderRadius: 24, borderWidth: 1, borderColor: '#c4b5fd' },
  center: { alignItems: 'center', padding: 24 },
  err: { color: '#b91c1c', textAlign: 'center', marginBottom: 10 },
  empty: { textAlign: 'center', marginTop: 40, color: THEME.text },
  btn: { backgroundColor: THEME.main, paddingHorizontal: 22, paddingVertical: 10, borderRadius: 20 },
  btnTxt: { color: '#fff', fontWeight: '700' },
});

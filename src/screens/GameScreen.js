import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { fetchPage, artwork } from '../api';
import { THEME } from '../config';

const shuffle = (a) => [...a].sort(() => Math.random() - 0.5);

export default function GameScreen() {
  const [pool, setPool] = useState(null);
  const [error, setError] = useState(null);
  const [round, setRound] = useState(null); // {answer, options}
  const [picked, setPicked] = useState(null);
  const [hint, setHint] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);

  const newRound = useCallback((list) => {
    const opts = shuffle(list).slice(0, 4);
    setRound({ answer: opts[Math.floor(Math.random() * 4)], options: opts });
    setPicked(null);
    setHint(false);
  }, []);

  const load = useCallback(() => {
    setError(null);
    fetchPage(0, 151).then((r) => { setPool(r.items); newRound(r.items); }).catch(() => setError('Could not load the game.'));
  }, [newRound]);
  useEffect(() => { load(); }, [load]);

  const answer = (o) => {
    if (picked) return;
    setPicked(o);
    if (o.id === round.answer.id) {
      const next = streak + 1;
      setScore(score + 1);
      setStreak(next);
      setBest(Math.max(best, next));
    } else setStreak(0);
  };

  if (error) return <View style={s.center}><Text style={s.err}>{error}</Text><TouchableOpacity style={s.next} onPress={load}><Text style={s.nt}>Retry</Text></TouchableOpacity></View>;
  if (!round) return <ActivityIndicator style={{ flex: 1 }} size="large" color={THEME.main} />;

  const color = (o) => !picked ? THEME.card : o.id === round.answer.id ? '#22c55e' : o.id === picked.id ? '#ef4444' : THEME.card;
  return (
    <View style={s.wrap}>
      <Text style={s.score}>Score {score}   ·   Streak {streak}   ·   Best {best}</Text>
      <Text style={s.title}>Who's that Pokémon?</Text>
      <Image source={{ uri: artwork(round.answer.id) }} style={[s.img, !picked && { tintColor: '#000' }]} />
      {!picked && (
        <TouchableOpacity onPress={() => setHint(true)}>
          <Text style={s.hint}>{hint ? `Hint: starts with "${round.answer.name[0].toUpperCase()}", ${round.answer.name.length} letters` : '💡 Show hint'}</Text>
        </TouchableOpacity>
      )}
      {round.options.map((o) => (
        <TouchableOpacity key={o.id} style={[s.opt, { backgroundColor: color(o) }]} onPress={() => answer(o)}>
          <Text style={s.optTxt}>{o.name}</Text>
        </TouchableOpacity>
      ))}
      {picked && <TouchableOpacity style={s.next} onPress={() => newRound(pool)}><Text style={s.nt}>Next</Text></TouchableOpacity>}
    </View>
  );
}
const s = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', padding: 16, backgroundColor: THEME.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  score: { fontWeight: '700', color: THEME.main },
  title: { fontSize: 24, fontWeight: '800', color: THEME.text, marginTop: 8 },
  img: { width: 220, height: 220, marginVertical: 8 },
  hint: { color: THEME.main, marginBottom: 8 },
  opt: { alignSelf: 'stretch', padding: 14, borderRadius: 14, marginVertical: 5, borderWidth: 1, borderColor: '#c4b5fd' },
  optTxt: { textAlign: 'center', fontSize: 16, fontWeight: '600', textTransform: 'capitalize', color: THEME.text },
  next: { backgroundColor: THEME.main, paddingHorizontal: 30, paddingVertical: 12, borderRadius: 24, marginTop: 10 },
  nt: { color: '#fff', fontWeight: '700' },
  err: { color: '#b91c1c', marginBottom: 10 },
});

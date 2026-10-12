import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MAX_TEAM } from './config';

const KEY = 'pokedex_team_v1';
const TeamContext = createContext(null);
export const useTeam = () => useContext(TeamContext);

export function TeamProvider({ children }) {
  const [team, setTeam] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((v) => v && setTeam(JSON.parse(v)))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (loaded) AsyncStorage.setItem(KEY, JSON.stringify(team)).catch(() => {});
  }, [team, loaded]);

  const has = (id) => team.some((p) => p.id === id);
  const isFull = team.length >= MAX_TEAM;
  const add = (p) => setTeam((t) => (t.length >= MAX_TEAM || t.some((x) => x.id === p.id) ? t : [...t, p]));
  const remove = (id) => setTeam((t) => t.filter((p) => p.id !== id));

  return <TeamContext.Provider value={{ team, has, isFull, add, remove }}>{children}</TeamContext.Provider>;
}

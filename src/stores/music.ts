import { defineStore } from "pinia";
import { supabase } from "../core/lib/supabaseClient.ts";
import { useCharacterStore } from "./character.ts";
export type DbSong = {
  id: string;
  spotifyId: string;
  message: string;
};

export type SpotifyTrack = {
  id: string;
  name: string;
  album: string;
  artists: string[];
  imageUrl?: string;
  uri?: string;
};
//levels increase
const INCREASE_LEVEL = 0.2;
const DECREASE_LEVEL = -0.2;
export const useMusicStore = defineStore("music", {
  state: () => ({
    song: null as DbSong | null,
    spotifyTrack: null as SpotifyTrack | null,
  }),
  getters: {
    hasSong: (state) => Boolean(state.song?.id),
    hasSpotifyTrack: (state) => Boolean(state.spotifyTrack?.id),
  },
  actions: {
    setSong(song: DbSong | null) {
      this.song = song;
    },
    setSpotifyTrack(track: SpotifyTrack | null) {
      this.spotifyTrack = track;
    },
    async loadSongFromDb() {
      const { data, error } = await supabase
        .from("MusicRecomendations")
        .select("*")
        .limit(1)
        .maybeSingle();
      if (error) {
        console.warn("Music recommendation query failed:", error);
        return;
      }
      this.song = data ?? null;
    },
    async loadSpotifyTrackById(trackId: string) {
      const tokenObj = localStorage.getItem(
        "sb-hjuacsvuuqkexnpfhywo-auth-token",
      );
      if (!tokenObj) {
        console.warn("No Spotify auth token found in localStorage.");
        this.spotifyTrack = null;
        return;
      }

      const token = JSON.parse(tokenObj).provider_token;
      if (!token) {
        console.warn("Spotify provider token is not available.");
        this.spotifyTrack = null;
        return;
      }

      const response = await fetch(
        `https://api.spotify.com/v1/tracks/${trackId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        console.warn("Spotify track request failed:", await response.text());
        this.spotifyTrack = null;
        return;
      }

      const track = await response.json();
      this.spotifyTrack = {
        id: track.id,
        name: track.name,
        album: track.album?.name ?? "",
        artists: track.artists?.map((artist: any) => artist.name) ?? [],
        imageUrl: track.album?.images?.[0]?.url,
        uri: track.uri,
      };
    },
    async loadSongAndSpotify() {
      await this.loadSongFromDb();
      if (this.song?.spotifyId) {
        await this.loadSpotifyTrackById(this.song.spotifyId);
      }
    },
    async increaseLevel(characterId: string) {
      const { error } = await supabase.rpc("update_character_level", {
        p_character_id: characterId,
        p_level_delta: INCREASE_LEVEL,
      });
      if (error) {
        console.warn("update increase Level failed:", error);
        return;
      }
      useCharacterStore().updateLevel(characterId, INCREASE_LEVEL);
    },
    async decreaseLevel(characterId: string) {
      const { error } = await supabase.rpc("update_character_level", {
        p_character_id: characterId,
        p_level_delta: DECREASE_LEVEL,
      });
      if (error) {
        console.warn("update descrease Level failed:", error);
        return;
      }
      useCharacterStore().updateLevel(characterId, DECREASE_LEVEL);
    },
  },
});

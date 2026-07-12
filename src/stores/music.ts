import { defineStore } from "pinia";
import { supabase } from "../core/lib/supabaseClient.ts";
import { useUserStore } from "./user.ts";
export type DbSong = {
  id: string;
  spotifyId: string;
  appleMusicId?: string | null;
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

export type recommendation = {
  id: string;
  spotifyId: string;
  message: string;
  user_id?: string;
};

export type SongRatingPayload = {
  song: string;
  artist: string;
  rating: number;
  feedback: string;
  user_id?: string;
};

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
        .neq("user_id", useUserStore().user?.id)
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
    async saveRecommendation(recommendation: recommendation) {
      const { error } = await supabase
        .from("MusicRecomendations")
        .insert([recommendation]);

      if (error) {
        console.warn("Music recommendation insert failed:", error);
        return false;
      }

      return true;
    },
    async saveSongRating(rating: SongRatingPayload) {
      const { error } = await supabase.from("SongRating").insert([rating]);

      if (error) {
        console.warn("Song rating insert failed:", error);
        return false;
      }

      return true;
    },
    async deleteSongRecommendation() {
      const { error } = await supabase
        .from("MusicRecomendations")
        .delete()
        .eq("id", this.song?.id);
      if (error) {
        console.warn("error deleting song");
        return;
      }
    },
  },
});

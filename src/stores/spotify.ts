import { defineStore } from "pinia";
import { supabase } from "../core/lib/supabaseClient.ts";

export type SpotifyUser = {
  id: string;
  displayName: string;
  email?: string;
  imageUrl?: string;
};

export type SpotifyPlaylist = {
  id: string;
  name: string;
  isPublic: boolean;
  imageUrl?: string;
};

type SpotifyStorage = {
  user: SpotifyUser | null;
};

const STORAGE_KEY = "spotifyStore_v1";

function readStorage(): Partial<SpotifyStorage> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeStorage(data: SpotifyStorage) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

const storedState = readStorage();

export const useSpotifyStore = defineStore("spotify", {
  state: () => ({
    user: storedState.user ?? null,
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.user),
  },
  actions: {
    persist() {
      writeStorage({
        user: this.user,
      });
    },
    setUser(user: SpotifyUser | null) {
      this.user = user;
      this.persist();
    },
    logout() {
      this.user = null;

      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
    },
    async loadPlaylists() {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.provider_token;

      if (!token) throw new Error("No hay un token de Spotify disponible.");

      const response = await fetch(
        "https://api.spotify.com/v1/me/playlists?limit=50",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!response.ok) throw new Error("No se pudieron cargar las playlists.");

      const data = await response.json();
      return (data.items ?? []).map(
        (playlist: any): SpotifyPlaylist => ({
          id: playlist.id,
          name: playlist.name,
          isPublic: Boolean(playlist.public),
          imageUrl: playlist.images?.[0]?.url,
        }),
      );
    },
    async addTrackToPlaylist(playlistId: string, trackId: string) {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.provider_token;

      if (!token) throw new Error("No hay un token de Spotify disponible.");

      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/items`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ uris: [`spotify:track:${trackId}`] }),
        },
      );

      if (!response.ok)
        throw new Error("No se pudo añadir la canción a la playlist.");
    },
  },
});

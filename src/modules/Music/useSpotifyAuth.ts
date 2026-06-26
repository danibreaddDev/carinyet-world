import { onMounted, onUnmounted } from "vue";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../../core/lib/supabaseClient.ts";
import { useSpotifyStore, type SpotifyUser } from "../../stores/spotify.ts";

function mapSupabaseUser(user: User): SpotifyUser {
  const metadata = user.user_metadata as Record<string, any>;

  return {
    id: user.id,
    displayName:
      metadata.full_name ??
      metadata.name ??
      metadata.user_name ??
      user.email ??
      "Spotify",
    email: user.email ?? undefined,
    imageUrl: metadata.avatar_url ?? metadata.picture,
  };
}

export function useSpotifyAuth() {
  const spotifyStore = useSpotifyStore();
  let unsubscribeAuth: (() => void) | undefined;

  const signInWithSpotify = async () => {
    if (spotifyStore.isAuthenticated) return;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "spotify",
      options: {
        redirectTo: window.location.href,
        scopes:
          "user-read-email user-read-private user-modify-playback-state user-read-playback-state",
      },
    });

    if (error) console.error("Spotify login error:", error.message);
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Spotify logout error:", error.message);

    spotifyStore.logout();
  };

  onMounted(async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) spotifyStore.setUser(mapSupabaseUser(data.user));

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          spotifyStore.setUser(mapSupabaseUser(session.user));
          return;
        }

        spotifyStore.logout();
      },
    );

    unsubscribeAuth = () => listener.subscription.unsubscribe();
  });

  onUnmounted(() => {
    unsubscribeAuth?.();
  });

  return {
    spotifyStore,
    signInWithSpotify,
    logout,
  };
}

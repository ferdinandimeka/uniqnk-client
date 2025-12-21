// src/stream/StreamVideoClient.tsx
import { StreamVideo, StreamVideoProvider } from "@stream-io/video-react-native-sdk";
import React, { useEffect, useMemo, useState } from "react";

type Props = {
  children: React.ReactNode;
  tokenEndpoint: string; // "https://yourserver.com/token"
  userId: string;
  userName?: string;
};

export default function StreamVideoClient({ children, tokenEndpoint, userId, userName }: Props) {
  const [token, setToken] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    async function getToken() {
      try {
        const resp = await fetch(tokenEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, name: userName }),
        });
        const json = await resp.json();
        setToken(json.token);
        setApiKey(json.apiKey);
      } catch (err) {
        console.error("Failed to fetch Stream token", err);
      }
    }
    if (userId) getToken();
  }, [tokenEndpoint, userId, userName]);

  // stream client needs apiKey + token on create — provider expects a client instance
  const client = useMemo(() => {
    if (!apiKey || !token) return null;
    try {
      // StreamVideo is provided as a factory/function by the SDK; call it instead of using `new`.
      // Cast to any to satisfy TypeScript typings from the SDK.
      return (StreamVideo as any)({ apiKey }); // will be used by provider; token used on connect
    } catch (e) {
      console.error("StreamVideo init error", e);
      return null;
    }
  }, [apiKey, token]);

  // connect the client with the fetched token once both are available
  useEffect(() => {
    if (!client || !token) return;
    try {
      // the SDK client may expose different connect methods; use a guarded any-cast to call connectUser/connect
      const c = client as any;
      if (typeof c.connectUser === "function") {
        c.connectUser({ id: userId, name: userName }, token);
      } else if (typeof c.connect === "function") {
        c.connect(token);
      }
    } catch (e) {
      console.error("StreamVideo connect error", e);
    }
  }, [client, token, userId, userName]);

  if (!client) return null;

  return (
    <StreamVideoProvider client={client}>
      {children}
    </StreamVideoProvider>
  );
}

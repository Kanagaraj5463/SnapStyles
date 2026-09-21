const fallbackConfiguration: RTCConfiguration = {
  iceServers: [{ urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] }],
};

export const getPeerConfiguration = async (): Promise<RTCConfiguration> => {
  const response = await fetch("/api/stream-config");
  if (!response.ok) return fallbackConfiguration;
  return response.json();
};

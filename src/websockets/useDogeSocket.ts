import { useEffect, useState } from "react";

export function useDogeSocket(url: string) {
  const [price, setPrice] = useState<string>("--");
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    setSocket(ws);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // aggTrade payload includes price under "p"
      setPrice(parseFloat(data.p).toFixed(6));
    };

    ws.onerror = (e) => console.error("WS error:", e);
    ws.onclose = () => console.log("WebSocket closed");

    return () => ws.close();
  }, [url]);

  return {
    price,
    socket,
  };
}

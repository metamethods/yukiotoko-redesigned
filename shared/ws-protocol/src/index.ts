import type { WebSocket } from "bun";

type WebSocketMessage<
  TType extends number,
  TData extends Record<TType, object>,
> = {
  [K in TType]: { type: K } & TData[K];
}[TType];

export class WebSocketProtocol<
  TType extends number,
  TData extends Record<TType, Object>,
> {
  public onOpen?: () => void;
  public onClose?: () => void;
  public onMessage?: (message: WebSocketMessage<TType, TData>) => void;

  constructor() {}

  public connect(url: string) {
    const websocket = new WebSocket(url);

    if (this.onOpen) websocket.onopen = this.onOpen;

    websocket.onclose = (event) => {
      if (this.onClose) this.onClose();
      if (event.code == 1006)
        setTimeout(() => {
          this.connect(url);
        }, 5_000);
    };

    websocket.onmessage = (event) => {
      const parsedData = JSON.parse(event.data) as WebSocketMessage<
        TType,
        TData
      >;

      if (this.onMessage) this.onMessage(parsedData);
    };
  }

  public serialize<K extends TType>(messageType: K, data: TData[K]): string {
    return JSON.stringify({
      type: messageType,
      ...data,
    });
  }
}

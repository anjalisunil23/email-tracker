declare module "localtunnel" {
  import { EventEmitter } from "events";

  interface TunnelOptions {
    port: number;
    subdomain?: string;
    host?: string;
  }

  interface Tunnel extends EventEmitter {
    url: string;
    close(): void;
  }

  function localtunnel(options: TunnelOptions): Promise<Tunnel>;
  export = localtunnel;
}

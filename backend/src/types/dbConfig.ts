export interface DBConfig {
  user: string;
  password: string;
  server: string;
  database: string;
  port: number;
  options: {
    encrypt: boolean;
    trustServerCertificate: boolean;
  };
  pool: {
    max: number;
    min: number;
    idleTimeoutMillis: number;
  };
}

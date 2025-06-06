export interface ApiResponse<T> {
  status: number;
  result: T;
  message?: string;
}

export interface ErrorResponse {
  status: number;
  message: string;
  error?: any;
}

export interface CacheConfig {
  enabled: boolean;
  duration: number;
}

export interface ApiConfig {
  timeout: number;
  retries: number;
  caching: CacheConfig;
}

// Add these new interfaces while keeping existing ones
export interface ApiOptions {
  useCache?: boolean;
  retries?: number;
  timeout?: number;
}

export interface ApiServiceConfig {
  enableCaching?: boolean;
  defaultTimeout?: number;
  maxRetries?: number;
}

export interface StorageConfig {
  prefix?: string;
  storage?: 'local' | 'session';
}

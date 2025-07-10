export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

export type ContentType = 
  | 'application/json'
  | 'application/xml'
  | 'text/xml'
  | 'application/x-www-form-urlencoded'
  | 'multipart/form-data'
  | 'text/plain'
  | 'text/html'
  | 'application/javascript'
  | 'text/css'
  | 'custom';

export interface HttpHeader {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export interface HttpRequest {
  method: HttpMethod;
  url: string;
  headers: HttpHeader[];
  body: string;
  contentType: ContentType;
  customContentType?: string;
}

export interface HttpResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  responseTime: number;
  size: number;
}

export interface RequestHistory {
  id: string;
  timestamp: number;
  request: HttpRequest;
  response?: HttpResponse;
  error?: string;
}

export interface FormattedResponse {
  formatted: string;
  language: string;
  isValid: boolean;
  error?: string;
}

export interface RequestPreset {
  id: string;
  name: string;
  request: HttpRequest;
  createdAt: number;
}
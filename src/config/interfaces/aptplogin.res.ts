export interface AptpResponse{
  "status": Status,
  "requestId": number,
  "processUrl": string,
}
interface Status {
  status: string;
  reason: string;
  message: string;
  date: string;
}
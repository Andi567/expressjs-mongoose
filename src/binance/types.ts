// type utils
export type KeyValuePairs<T extends string> = { [K in T]: K };

// binance
export interface DebugBinanceP2PConfig {
  httpRequests?: boolean;
  httpResponses?: boolean;
}

export interface BinanceP2PConfig {
  baseUrl?: string;
  accessKey: string;
  secretKey: string;
  debug?: DebugBinanceP2PConfig;
}

export type BinanceTradeTypes = "BUY" | "SELL";

export type BinanceTradeTypesMap = KeyValuePairs<BinanceTradeTypes>;

export interface FetchOrderChatMessagesParams {
  orderNumber: number;
  page?: number;
  rows?: number;
}

export interface PerformP2PAdsSearchParams {
  asset: string;
  fiat: string;
  tradeType?: BinanceTradeTypes;
  transAmount?: number;
}

export interface UpdateAdParams {
  adNumber: number;
  status: number;
}

export interface FetchTradeHistoryParams {
  tradeType: BinanceTradeTypes;
}

export interface ReleaseOrderFundsParams {
  authType?: "GOOGLE" | "SMS" | "FIDO2" | "FUND_PWD";
  code?: string;
  confirmPaidType?: "quick" | "normal";
  emailVerifyCode?: string;
  googleVerifyCode?: string;
  mobileVerifyCode?: string;
  orderNumber: string;
  payId?: number; // ad payment method id
  yubikeyVerifyCode?: string;
}

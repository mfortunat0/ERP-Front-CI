export interface ListType {
  NCONT: number;
  NOME: string;
  DTEMIS: string;
  CODLISTC: number;
  TIPOLIST: number;
  TOTAL_ITENS: number;
}

export interface ListItem {
  CODLISTI: number;
  CODPRO: string;
  DESCR: string;
  CODUNI: string;
  QTDADE: number;
  LOCAL: string;
  EAN: string;
  SALDO: number;
}

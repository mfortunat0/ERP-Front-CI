interface Product {
  CODPRO: string;
  DESCR: string;
  VRVENDA?: number;
  EAN?: string;
  LOCAL?: string;
  FAMILIA?: string;
  VRATAC?: number;
  VRCUSTO?: number;
  CODUNI?: string;
  ETQ?: string;
  ETQEMB?: string;
  PESOL?: number;
  OBS?: string;
  SALDO?: number;
  SALDO_1?: number;
  SALDO_3?: number;
  ULT_COMPRA?: string;
  QTD_ULT_COMPRA?: number;
  VENDA_ULT_COMPRA?: number;
  PEREQUE?: {
    SALDO: number;
    ULT_COMPRA?: string;
    QTD_ULT_COMPRA?: number;
    VENDA_ULT_COMPRA?: number;
  };
  COD_FORN?: number;
}

interface ProductList extends Product {
  QTD: number;
}

interface ProductComplementarResponse {
  CODPRO: string;
  DESCR: string;
  CODUNI: string;
  VRVENDA: number;
  VRATAC: number;
  CODPRO_SEMELHANTE: string;
  DESCR_S: string;
  CODUNI_S: string;
  VRVENDA_S: number;
  VRATAC_S: number;
  CODPRO_1: string;
  DESCR_1: string;
  CODUNI_1: string;
  VRVENDA_1: number;
  VRATAC_1: number;
  CODPRO_2: string;
  DESCR_2: string;
  CODUNI_2: string;
  VRVENDA_2: number;
  VRATAC_2: number;
  CODPRO_3: string;
  DESCR_3: string;
  CODUNI_3: string;
  VRVENDA_3: number;
  VRATAC_3: number;
  CODPRO_4: string;
  DESCR_4: string;
  CODUNI_4: string;
  VRVENDA_4: number;
  VRATAC_4: number;
  CODPRO_5: string;
  DESCR_5: string;
  CODUNI_5: string;
  VRVENDA_5: number;
  VRATAC_5: number;
}

interface BalanceProductResponse {
  CODFIR: number;
  SALDO: number;
  ULT_COMPRA: string;
}

interface BalanceProduct {
  SALDOS: BalanceProductResponse[];
  ID: number;
}

interface BalanceVenda {
  venda: number;
  qtd_compra: number;
}

interface List {
  NCONT: number;
  NOME: string;
  DTEMIS: string;
  CODLISTC: number;
  TOTAL_ITENS: number;
}

interface ListItem {
  CODLISTI: number;
  CODPRO: string;
  DESCR: string;
  CODUNI: string;
  QTDADE: number;
  LOCAL: string;
  EAN: string;
  SALDO: number;
  FAMILIA: string;
}

interface Firma {
  CODCLI: number;
  FIRMA: string;
  FANTASIA: string;
  CNPJ: string;
  OBS: string;
  LIMCRED: number;
  SALDEV: number;
  CODSPC: number;
}

interface Vendedor {
  CODVEN: number;
  NOME: string;
}

export type {
  BalanceProductResponse,
  BalanceProduct,
  BalanceVenda,
  Product,
  ProductList,
  List,
  ListItem,
  Firma,
  Vendedor,
  ProductComplementarResponse,
};

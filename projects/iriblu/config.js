const structure = {
  targetDir: 'imports',
  prefix: 'iriblu_',
};

const knexConfig = {
  client: 'mysql',
  connection: {
    host: 'irid.blue',
    user: 'meteor',
    password: 'MemorableHieroglyphs+2-1-1',
    database: 'meteor_data'
  }
};

/* eslint-disable camelcase */
const sourceTables = [
  {
    name: 'tb_batch',
    alias: {
      o: 'batch',
      c: 'batch',
      l: 'batch',
      u: 'Batch',
      tl: 'batch',
      tu: 'Batch'
    }
  },
  {
    name: 'tb_batch_lines',
    alias: {
      o: 'batch_item',
      c: 'batchItem',
      l: 'batchitem',
      u: 'BatchItem',
      tl: 'batch item',
      tu: 'Batch Item'
    }
  },
  {
    name: 'tb_entregas',
    alias: {
      o: 'delivery',
      c: 'delivery',
      l: 'delivery',
      u: 'Delivery',
      tl: 'delivery',
      tu: 'Delivery'
    }
  },
  {
    name: 'tb_entregas_lines',
    alias: {
      o: 'delivery_item',
      c: 'deliveryItem',
      l: 'deliveryitem',
      u: 'DeliveryItem',
      tl: 'delivery item',
      tu: 'Delivery Item'
    },
    sequelize: {
      attributeNameMap: {
        entrega_lines_id: { db: 'item_id', orm: 'itemId' },
        entrega_id: { db: 'fk_delivery', orm: 'fkDelivery' },
        cod: { db: 'code', orm: 'code' }
      }
    },
    srvrUnitTest: {
      expected: 'IBAA001',
      colExpected: 2,
    },
    resolvers: {
      mainName: 'code',
      createParms: [ 2, 3 ]
    },
    typeDef: {
      queries: {
        note: 'The items of the delivery note "fkDelivery"',
        noteCols: [ 1, 2, 3, 4 ],
        cols: [ 1, 2, 3, 4 ],
      },
      mutations: {
        colsCreate: [ 2, 3 ],
        colsCreateVar: [ 3, '"IBIB004"' ],
        colsCreateRsvp: [ 1, 3 ],
        colsHide: [ 1 ],
        colsHideVar: [ 3 ],
        colsHideRsvp: [ 2 ],
        colsUpdate: [ 1, 2, 3 ],
        colsUpdateVar: [ 999, 444, '"Izzz004"' ],
        colsUpdateRsvp: [ 1, 2, 3 ],
        colsUpdateReqd: [ '!', '', '' ],
      },
      types: ''
    }
  },
  {
    name: 'tb_envases',
    alias: {
      o: 'bottle',
      c: 'bottle',
      l: 'bottle',
      u: 'Bottle',
      tl: 'bottle',
      tu: 'Bottle'
    }
  },
  {
    name: 'tb_ib_partners_especial_data',
    alias: {
      o: 'partner_profile',
      c: 'partnerProfile',
      l: 'partnerprofile',
      u: 'PartnerProfile',
      tl: 'partner profile',
      tu: 'Partner Profile'
    }
  },
  {
    name: 'tb_invoices',
    alias: {
      o: 'invoice',
      c: 'invoice',
      l: 'invoice',
      u: 'Invoice',
      tl: 'invoice',
      tu: 'Invoice'
    }
  },
  {
    name: 'tb_invoices_lines',
    alias: {
      o: 'invoice_item',
      c: 'invoiceItem',
      l: 'invoiceitem',
      u: 'InvoiceItem',
      tl: 'invoice item',
      tu: 'Invoice Item'
    }
  },
  {
    name: 'tb_invoices_list',
    alias: {
      o: 'invoice_list',
      c: 'invoiceList',
      l: 'invoicelist',
      u: 'InvoiceList',
      tl: 'invoice list',
      tu: 'Invoice List'
    }
  },
  {
    name: 'tb_invoices_referente',
    alias: {
      o: 'referral_invoice',
      c: 'referralInvoice',
      l: 'referralinvoice',
      u: 'ReferralInvoice',
      tl: 'referral invoice',
      tu: 'Referral Invoice'
    }
  },
  {
    name: 'tb_partners',
    alias: {
      o: 'partner',
      c: 'partner',
      l: 'partner',
      u: 'Partner',
      tl: 'partner',
      tu: 'Partner'
    }
  },
  {
    name: 'tb_payments',
    alias: {
      o: 'payment',
      c: 'payment',
      l: 'payment',
      u: 'Payment',
      tl: 'payment',
      tu: 'Payment'
    }
  },
  {
    name: 'tb_products',
    alias: {
      o: 'product',
      c: 'product',
      l: 'product',
      u: 'Product',
      tl: 'product',
      tu: 'Product'
    }
  },
  {
    name: 'tb_products_prices',
    alias: {
      o: 'product_price',
      c: 'productPrice',
      l: 'productprice',
      u: 'ProductPrice',
      tl: 'product price',
      tu: 'Product Price'
    }
  },
  {
    name: 'tb_recepciones',
    alias: {
      o: 'return',
      c: 'return',
      l: 'return',
      u: 'Return',
      tl: 'return',
      tu: 'Return'
    }
  },
  {
    name: 'tb_recepciones_lines',
    alias: {
      o: 'return_item',
      c: 'returnItem',
      l: 'returnitem',
      u: 'ReturnItem',
      tl: 'return item',
      tu: 'Return Item'
    }
  },
  {
    name: 'tb_water_free',
    alias: {
      o: 'water_free',
      c: 'waterFree',
      l: 'waterfree',
      u: 'WaterFree',
      tl: 'water free',
      tu: 'Water Free'
    }
  },
  {
    name: 'tb_water_prices',
    alias: 'water_price',
  },
];
/* eslint-enable camelcase */


module.exports = {
  rdbmsConfig: knexConfig,
  tables: sourceTables,
  structure,
};

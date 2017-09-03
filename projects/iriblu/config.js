const structure = {
  targetDir: 'imports',
  prefix: 'iriblu_',
};

const knexConfig = {
  client: 'mysql',
  connection: {
    host: 'db_srv',
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
      attrAdaptationMap: {
        entrega_lines_id: { op: 1, db: 'item_id', orm: 'itemId', null: '' },
        entrega_id: { op: 2, db: 'fk_delivery', orm: 'fkDelivery', null: '' },
        cod: { op: 3, db: 'code', orm: 'code', null: '' }
      },
      insert:
       `INSERT INTO delivery_item (
           item_id
         , fk_delivery
         , code
         , createdAt
         , updatedAt
         , deletedAt )
        SELECT
           l.entrega_lines_id as item_id
         , l.entrega_id as fk_delivery
         , l.cod as code
         , e.date_entrega as createdAt
         , e.date_entrega as updatedAt
         , null
        FROM tb_entregas_lines l, tb_entregas e
        WHERE l.entrega_id = e.entrega_id`
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
    },
    sequelize: {
      attrAdaptationMap: {
        partner_id: { op: 1, db: 'partner_id', orm: 'partnerId', null: '' },
        partner_name: { op: 2, db: 'partner_name', orm: 'partnerName', null: '' },
        partner_company: { op: 3, db: 'is_corporate', orm: 'isCorporate', null: '' },
        partner_client: { op: 4, db: 'is_client', orm: 'isClient', null: '' },
        partner_supplier: { op: 5, db: 'is_supplier', orm: 'isSupplier', null: '' },
        partner_civil_status: { op: 6, db: 'civil_status', orm: 'civilStatus', null: 'true' },
        partner_gender: { op: 7, db: 'gender', orm: 'gender', null: 'true' },
        partner_nationality: { op: 8, db: 'nationality', orm: 'nationality', null: 'true' },
        partner_legal_id: { op: 9, db: 'citizen_id', orm: 'citizenId', null: 'true' },
        partner_group_code: { op: 10, db: 'group_code', orm: 'groupCode', null: '' },
        partner_telf_primary: { op: 11, db: 'phone_primary', orm: 'phonePrimary', null: '' },
        partner_telf_secundary: { op: 12, db: 'phone_secondary', orm: 'phoneSecondary', null: '' },
        partner_celular_phone: { op: 13, db: 'phone_mobile', orm: 'phoneMobile', null: '' },
        partner_email: { op: 14, db: 'email', orm: 'email', null: '' },
        partner_webPage: { op: 15, db: 'web_site', orm: 'webSite', null: '' },
        partner_contact_person: { op: 16, db: 'contact_person', orm: 'contactPerson', null: '' },
        partner_notes: { op: 17, db: 'notes', orm: 'notes', null: '' },
        partner_sales_person: { op: 18, db: 'sales_rep', orm: 'salesRep', null: '' },
        partner_status: { op: 19, db: 'status', orm: 'status', null: '' },
        partner_create_by: { op: 20, db: 'created_by', orm: 'createdBy', null: '' },
        partner_creation_date: { op: 21, db: 'createdAt', orm: 'createdAt', null: '' },
        partner_last_update: { op: 22, db: 'updatedAt', orm: 'updatedAt', null: '' },
        partner_country_acc: { op: 23, db: 'delivery_country', orm: 'deliveryCountry', null: '' },
        partner_state_acc: { op: 24, db: 'delivery_state', orm: 'deliveryState', null: '' },
        partner_city_acc: { op: 25, db: 'delivery_city', orm: 'deliveryCity', null: '' },
        partner_canton_acc: { op: 26, db: 'delivery_county', orm: 'deliveryCounty', null: '' },
        partner_parish_acc: { op: 24, db: 'delivery_parish', orm: 'deliveryParish', null: '' },
        partner_postal_code_acc: { op: 28, db: 'delivery_postal_code', orm: 'deliveryPostalCode', null: '' },
        street_acc: { op: 29, db: 'delivery_street', orm: 'deliveryStreet', null: '' },
        bulding_acc: { op: 30, db: 'delivery_street_no', orm: 'deliveryStreetNo', null: '' },
        country_res: { op: 31, db: 'residence_country', orm: 'residenceCountry', null: '' },
        state_res: { op: 32, db: 'residence_state', orm: 'residenceState', null: '' },
        city_res: { op: 33, db: 'residence_city', orm: 'residenceCity', null: '' },
        canton_res: { op: 34, db: 'residence_county', orm: 'residenceCounty', null: '' },
        parish_res: { op: 35, db: 'residence_parish', orm: 'residenceParish', null: '' },
        postal_code_res: { op: 36, db: 'residence_postal_code', orm: 'residencePostalCode', null: '' },
        street_res: { op: 37, db: 'residence_street', orm: 'residenceStreet', null: '' },
        bulding_res: { op: 38, db: 'residence_street_no', orm: 'residenceStreetNo', null: '' }
      },
      insert:
       `INSERT INTO partner (
           partner_id
         , partner_name
         , is_corporate
         , is_client
         , is_supplier
         , civil_status
         , gender
         , nationality
         , citizen_id
         , group_code
         , phone_primary
         , phone_secondary
         , phone_mobile
         , email
         , web_site
         , contact_person
         , notes
         , sales_rep
         , status
         , created_by
         , createdAt
         , updatedAt
         , delivery_country
         , delivery_state
         , delivery_city
         , delivery_county
         , delivery_parish
         , delivery_postal_code
         , delivery_street
         , delivery_street_no
         , residence_country
         , residence_state
         , residence_city
         , residence_county
         , residence_parish
         , residence_postal_code
         , residence_street
         , residence_street_no )
        SELECT
           p.partner_id as partner_id
         , p.partner_name as partner_name
         , p.partner_company as is_corporate
         , p.partner_client as is_client
         , p.partner_supplier as is_supplier
         , p.partner_civil_status as civil_status
         , p.partner_gender as gender
         , p.partner_nationality as nationality
         , p.partner_legal_id as citizen_id
         , p.partner_group_code as group_code
         , p.partner_telf_primary as phone_primary
         , p.partner_telf_secundary as phone_secondary
         , p.partner_celular_phone as phone_mobile
         , p.partner_email as email
         , p.partner_webPage as web_site
         , p.partner_contact_person as contact_person
         , p.partner_notes as notes
         , p.partner_sales_person as sales_rep
         , p.partner_status as status
         , p.partner_create_by as created_by
         , p.partner_creation_date as createdAt
         , p.partner_last_update as updatedAt
         , p.partner_country_acc as delivery_country
         , p.partner_state_acc as delivery_state
         , p.partner_city_acc as delivery_city
         , p.partner_canton_acc as delivery_county
         , p.partner_parish_acc as delivery_parish
         , p.partner_postal_code_acc as delivery_postal_code
         , p.street_acc as delivery_street
         , p.bulding_acc as delivery_street_no
         , p.country_res as residence_country
         , p.state_res as residence_state
         , p.city_res as residence_city
         , p.canton_res as residence_county
         , p.parish_res as residence_parish
         , p.postal_code_res as residence_postal_code
         , p.street_res as residence_street
         , p.bulding_res as residence_street_no
        FROM tb_partners p`
    },
    srvrUnitTest: {
      expected: 'Dashiel Hammet',
      colExpected: 2,
    },
    resolvers: {
      mainName: 'email',
      createParms: [ 2, 3, 4, 5, 9, 14, 19 ]
    },
    typeDef: {
      queries: {
        note: 'Partner data',
        noteCols: [ 1, 2, 3, 4, 5, 9, 14, 19 ],
        cols: [ 1, 2, 3, 4, 5, 9, 14, 19 ],
      },
      mutations: {
        colsCreate: [ 2, 3, 4, 5, 9, 14, 19 ],
        colsCreateVar: [ '"Dashiel Hammet"', '"Y"', '"Y"', '"Y"', '"171393141-6"', '"a@b.c"', '"A"' ],
        colsCreateRsvp: [ 1, 2, 3, 4, 5, 9, 14, 19 ],

        colsHide: [ 1 ],
        colsHideVar: [ 565 ],
        colsHideRsvp: [ 1 ],

        colsUpdate: [ 1, 2, 3, 4, 5, 9, 14, 19 ],
        colsUpdateVar: [ 654, '"Dashiel Hammet"', '"Y"', '"Y"', '"Y"', '"171393141-6"', '"a@b.c"', '"A"' ],
        colsUpdateRsvp: [ 1, 2, 3, 4, 5, 9, 14, 19 ],
        colsUpdateReqd: [ '!', '!', '!', '!', '!', '', '', '!' ],
      },
      types: ''
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

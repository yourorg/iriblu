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
      attributeNameMap: {
        entrega_lines_id: { db: 'item_id', orm: 'itemId' },
        entrega_id: { db: 'fk_delivery', orm: 'fkDelivery' },
        cod: { db: 'code', orm: 'code' }
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
      attributeNameMap: {
        partner_id: { db: 'partner_id', orm: 'partnerId' },
        partner_name: { db: 'partner_name', orm: 'partnerName' },
        partner_company: { db: 'is_corporate', orm: 'isCorporate' },
        partner_client: { db: 'is_client', orm: 'isClient' },
        partner_supplier: { db: 'is_supplier', orm: 'isSupplier' },
        partner_civil_status: { db: 'civil_status', orm: 'civilStatus' },
        partner_gender: { db: 'gender', orm: 'gender' },
        partner_nationality: { db: 'nationality', orm: 'nationality' },
        partner_legal_id: { db: 'citizen_id', orm: 'citizenId' },
        partner_group_code: { db: 'group_code', orm: 'groupCode' },
        partner_telf_primary: { db: 'phone_primary', orm: 'phonePrimary' },
        partner_telf_secundary: { db: 'phone_secondary', orm: 'phoneSecondary' },
        partner_celular_phone: { db: 'phone_mobile', orm: 'phoneMobile' },
        partner_email: { db: 'email', orm: 'email' },
        partner_webPage: { db: 'web_site', orm: 'webSite' },
        partner_contact_person: { db: 'contact_person', orm: 'contactPerson' },
        partner_notes: { db: 'notes', orm: 'notes' },
        partner_sales_person: { db: 'sales_rep', orm: 'salesRep' },
        partner_status: { db: 'status', orm: 'status' },
        partner_create_by: { db: 'created_by', orm: 'createdBy' },
        partner_creation_date: { db: 'createdAt', orm: 'createdAt' },
        partner_last_update: { db: 'updatedAt', orm: 'updatedAt' },
        partner_country_acc: { db: 'delivery_country', orm: 'deliveryCountry' },
        partner_state_acc: { db: 'delivery_state', orm: 'deliveryState' },
        partner_city_acc: { db: 'delivery_city', orm: 'deliveryCity' },
        partner_canton_acc: { db: 'delivery_county', orm: 'deliveryCounty' },
        partner_parish_acc: { db: 'delivery_parish', orm: 'deliveryParish' },
        partner_postal_code_acc: { db: 'delivery_postal_code', orm: 'deliveryPostalCode' },
        street_acc: { db: 'delivery_street', orm: 'deliveryStreet' },
        bulding_acc: { db: 'delivery_street_no', orm: 'deliveryStreetNo' },
        country_res: { db: 'residence_country', orm: 'residenceCountry' },
        state_res: { db: 'residence_state', orm: 'residenceState' },
        city_res: { db: 'residence_city', orm: 'residenceCity' },
        canton_res: { db: 'residence_county', orm: 'residenceCounty' },
        parish_res: { db: 'residence_parish', orm: 'residenceParish' },
        postal_code_res: { db: 'residence_postal_code', orm: 'residencePostalCode' },
        street_res: { db: 'residence_street', orm: 'residenceStreet' },
        bulding_res: { db: 'residence_street_no', orm: 'residenceStreetNo' }
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
      expected: 'IBAA001',
      colExpected: 2,
    },
    resolvers: {
      mainName: 'email',
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

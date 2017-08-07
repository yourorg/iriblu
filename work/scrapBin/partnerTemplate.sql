-- select
--     COLUMN_NAME
--   , IS_NULLABLE
--   , DATA_TYPE
--   , CHARACTER_MAXIMUM_LENGTH
--   , COLUMN_TYPE
--   , COLUMN_KEY
--   , EXTRA
--   , COLUMN_DEFAULT
-- from
--   information_schema.COLUMNS
-- where
--   table_schema='meteor_data'
-- and
--   table_name='tb_partners'
-- limit 2
-- ;

select
  -- "{ first: '" || COLUMN_NAME || "', last: '" || COLUMN_TYPE || "' },"
  CONCAT("{ colName: '", COLUMN_NAME
    , "', last: '", COLUMN_TYPE, "' },")
from
  information_schema.COLUMNS
where
  table_schema='meteor_data'
and
  table_name='tb_partners'
limit 2
;


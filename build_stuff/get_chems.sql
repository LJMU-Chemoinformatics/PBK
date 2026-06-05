use pbpk;

select a.excel_id, b.chem_name, a.relationship, b.dtxcid, a.parent_name, b.dtxsid, b.casrn_pubchem, b.cas_ccte from f_chem_instance a, f_chem b  where a.chem_excel_id = b.excel_id order by a.excel_id;
#--  select concat("chems[",a.excel_id,"] = new chem(",a.excel_id,'"', b.chem_name,'","', a.relationship,'","', b.dtxcid,'","', a.parent_name,'","', b.dtxsid,'","',b.casrn_pubchem,'","',b.cas_ccte,'");') from f_chem_instance a, f_chem b where a.chem_excel_id = b.excel_id order by a.excel_id ;


#-- select
#-- CONCAT('chems[',
#-- a.excel_id,
#-- '] = new chem("',
#-- a.excel_id,
#-- '","',
#-- b.chem_name,
#-- '","',
#-- a.relationship,
#-- '","',
#-- b.dtxcid,
#-- '","',
#-- a.parent_name,
#-- '","',
#-- b.dtxsid,
#-- '","',
#-- b.casrn_pubchem,
#-- '","',
#-- b.cas_ccte,
#-- '");'
#-- )
#-- from f_chem_instance a, f_chem b  where a.chem_excel_id = b.excel_id order by a.excel_id;
#-- 
#--  chems[2]  =   new chem(2,"methylmercury","","DTXCID504198","","DTXSID9024198");
#--  chems[3]  =   new chem(3,"BDE-126","","DTXCID00382151","","DTXSID40431319");

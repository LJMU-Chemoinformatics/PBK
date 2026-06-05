use pbpk;
select a.excel_id, b.chem_name, a.relationship, b.dtxcid, a.parent_name, b.dtxsid from f_chem_instance a, f_chem b where a.chem_excel_id = b.excel_id order by a.excel_id ;


if(vol is not null,vol,"n/a/")

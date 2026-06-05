USE pbpk;
SELECT CONCAT("species[",id,"] = \"",name,"\";") FROM f_tax  ORDER BY id;
SELECT CONCAT("species_full[",id,"] = \"",Full_tax_name(id),"\";") FROM f_tax  ORDER BY id;



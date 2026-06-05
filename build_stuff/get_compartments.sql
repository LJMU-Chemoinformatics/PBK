USE pbpk;
SELECT CONCAT("compartments[",id,"] = \"",compartment,"\";") FROM f_compartment WHERE id = mapped_id  ORDER BY id;



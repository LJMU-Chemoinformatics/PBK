USE pbpk;
SELECT CONCAT("software[",id,"] = \"",term_controlled,"\";") FROM n_software WHERE id = mapped_id ORDER BY id;


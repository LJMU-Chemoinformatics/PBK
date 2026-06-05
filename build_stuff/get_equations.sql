USE pbpk;
SELECT CONCAT("equation[",id,"] = \"",term_controlled,"\";") FROM n_equation WHERE id = mapped_id ORDER BY id;




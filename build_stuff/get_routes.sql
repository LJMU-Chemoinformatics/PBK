USE pbpk;
SELECT CONCAT("routes[",id,"] = \"",route,"\";") FROM f_route WHERE id = mapped_id  ORDER BY id;



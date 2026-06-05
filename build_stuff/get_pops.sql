USE pbpk;
SELECT CONCAT("populations[",id,"] = new population(",taxid,", ",gender_id, ", ",stage_id , ");") FROM f_population ;


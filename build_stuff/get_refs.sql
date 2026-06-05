USE pbpk;
SELECT CONCAT("refs[",id, "] = new ref(\"", author,"\",",year,",\"",journal,"\",\"",if(vol is not null,vol,"n/a/"),"\",\"",if(pages is not null,pages,"n/a"),"\",",if(pubmed_id is not null,pubmed_id,"n/a"),",\"",if(doi is not null,doi,"n/a"),"\");") from f_ref order by id;



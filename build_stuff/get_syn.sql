use pbpk;
select a.cas, a.syn, b.rank, a.source from cassyn3 a, type_rank b where a.type = b.type_name and b.type = "name" order by b.rank, a.cas, a.syn;


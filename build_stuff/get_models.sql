USE pbpk;
SELECT CONCAT('models[',a.excel_id,'] = new Model(',b.excel_id,',"',IF(c.relationship IS NULL,'-',c.relationship),'",',a.population_id,',',a.route_id,',',a.ref_id,',',a.equation_id,',',a.software_id,',"',IF(a.notes IS NULL,'-',a.notes),'");') FROM n_model a, n_chemical b, n_chemical_instance c WHERE a.chem_instance_id = c.excel_id AND b.excel_id = c.chem_excel_id  ORDER BY a.excel_id;




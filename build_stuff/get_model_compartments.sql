use pbpk;
select concat("models[",excel_id,"].compartments = [", group_CONCAT(compartment_id SEPARATOR ',') ,"];") from n_model_compartment group by excel_id ;

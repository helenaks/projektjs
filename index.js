"use strict";



create_levels_filter();
create_subjects_filter();
create_language_filter();
create_countries_cities_filters();


document.querySelector("#search_field button").addEventListener("click", update_programmes);


document.querySelector("#country_filter button").addEventListener("click", toggle_cities);

update_programmes();


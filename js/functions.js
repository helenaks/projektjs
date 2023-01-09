"use strict"


function click_filter_element(event) {

    const classList = event.currentTarget.classList;
    const checkClass = classList.contains("selected")

    if (checkClass) {
        classList.remove("selected");
    } else {
        classList.add("selected");
    }

    update_programmes();
}



function create_filter_element(data) {

    const element = document.createElement("li");
    element.classList.add(data.class);
    data.parent.append(element);
    element.textContent = data.textContent;
    element.addEventListener("click", click_filter_element);

    return element;

}



function add_group_toggling(filter_container_dom) {


}



function toggle_cities(event) {
    const allCities = document.querySelectorAll(
        "#country_filter > ul > div > ul > li"
    );
    const madridCity = allCities[0];
    if (madridCity.classList.contains("selected")) {
        for (let i = 0; i < allCities.length; i++) {
            allCities[i].classList.remove("selected");
        }
    } else {
        for (let i = 0; i < allCities.length; i++) {
            allCities[i].classList.add("selected");
        }
    }

    update_programmes();

}


/*
NO ARGUMENTS

SIDE EFFECTS 
create dom-elements (countries and cities filters)

NO RETURN
*/
function create_countries_cities_filters() {

    /*
ARGUMENTS
country: object that contains id, name and imagesNormal.

SIDE EFFECTS
creates dom-element and adds two classnames
adds an id to the dom-element, the id is taken from the argument.
Appends the dom-element to an ul-element that has parent-element with the id country_filter
Sets the dom-element to the html, country.name inside <h1> and ul with classname filter_list
Finds which cities satisfies the test and then loops through every city with the above steps. 

NO RETURN
*/
    function create_country(country) {
        console.log(country);
        const dom = document.createElement("div");
        dom.classList.add("country");
        dom.classList.add("filter_container");
        dom.id = "country_" + country.id;
        document.querySelector("#country_filter > ul").append(dom);

        dom.innerHTML = `
        <h1>${country.name}</h1>
        <ul class="filter_list"></ul>
      `;
        const cities = array_filter(CITIES, test_function);
        function test_function(city) {
            return city.countryID === country.id;
        }

        array_each(cities, create_city);
    }
    /*
ARGUMENTS
city: object that contains id, name, countryId and imagesNormal

SIDE EFFECTS: 
Calls create_filter_element to create a city filter element, takes object as an argument 
with parent, class and textContent keys. 
Sets dataset id to city id. 
Calls the function create_country once for each element in the COUNTRIES array, 
with the element as argument

NO RETURN
*/
    function create_city(city) {
        console.log(city);

        const dom = create_filter_element({
            parent: document.querySelector(`#country_${city.countryID} > ul`),
            class: "selected",
            textContent: city.name,
        });
        dom.dataset.id = city.id;

    }

    array_each(COUNTRIES, create_country);
}


/*
  ARGUMENTS
    programmesSpecs: LANGUAGES, LEVELS or SUBJECTS
    filterId: the id of the parent-element of the filters. 

  SIDE-EFFECTS

  creates dom-elements (filters)
   

  NO RETURN

*/

function createFilters(programmesSpecs, filterId) {
    function create_filter(filter) {
        const dom = create_filter_element({
            parent: document.querySelector(`#${filterId} > ul`),
            class: "selected",
            textContent: filter.name,
        });

        dom.dataset.id = filter.id;
    }

    array_each(programmesSpecs, create_filter);
}

function create_levels_filter() {
    function create_level(level) {
        const dom = create_filter_element({
            parent: document.querySelector("#level_filter > ul"),
            class: "selected",
            textContent: level.name,
        });
        dom.dataset.id = level.id;
    }
    array_each(LEVELS, create_level);
}

function create_subjects_filter() {
    function create_subject(subject) {
        const dom = create_filter_element({
            parent: document.querySelector("#subject_filter > ul"),
            class: "selected",
            textContent: subject.name,
        });
        dom.dataset.id = subject.id;
    }
    array_each(SUBJECTS, create_subject);
}

function create_language_filter() {
    function create_element(data) {
        const dom = create_filter_element({
            parent: document.querySelector("#language_filter > ul"),
            class: "selected",
            textContent: data.name,
        });
        dom.dataset.id = data.id;
    }
    array_each(LANGUAGES, create_element);
}


function create_programme(programme) {

    const university = UNIVERSITIES.find(function (university) {
        if (university.id == programme.universityID) return true;
    });

    const city = CITIES.find(function (city) {
        if (city.id == university.cityID) return true;
    });

    const country = COUNTRIES.find(function (country) {
        if (country.id == city.countryID) return true;
    });

    const subject = SUBJECTS.find(function (subject) {
        if (subject.id == programme.subjectID) return true;
    });

    const language = LANGUAGES.find(function (language) {
        if (language.id == programme.languageID) return true;
    });

    const level = LEVELS.find(function (level) {
        if (level.id == programme.levelID) return true;
    });

    const elementprogramme = document.createElement("li");

    elementprogramme.innerHTML =
        `<h1>${programme.name}</h1>
    <p>${university.name}</p>
    <p>${city.name},${country.name}</p>
    <p>${level.name}, ${subject.name}, ${language.name}</p>`;
    document.querySelector("#programmes>ul").append(elementprogramme)
}


function update_programmes() {
    const programmes = read_filters();

    if (programmes.length < 1) {

        document.querySelector('#programmes > p').style.display = 'block';
    } else {
        document.querySelector('#programmes > p').style.display = 'none';
    }

    const programmesContainer = document.querySelector("#programmes > ul");
    programmesContainer.innerHTML = "";

    programmes.forEach(function (programme) {
        create_programme(programme)
    }
    );

}



/*
   NO ARGUMENTS
     
   SIDE-EFFECTS
     Selects all list-items (cities) in the element with an id country_filter. 
     Finding the universities using the cities IDs from selected list-items.  
     Finding the programmes using the universities ids. 

     Selects all list-items (levels) in the element with an id level_filter. 
     Selects all list-items (languages) in the element with an id language_filter. 
     Selects all list-items (subjects) in the element with an id subject_filter.
     and returns a new array of programmes with all the elements in programmes that satisfy the check. 
 
   RETURN VALUE
       RETURN a list(array) of programs based on the selected filters,
       if nothing is selected it returns an empty list.
   */

function read_filters() {

    const city_selected_dom = document.querySelectorAll("#country_filter li.selected");

    const city_id_selected = [];
    function callback_add_cityID(dom_element) {
        const id_as_integer = parseInt(dom_element.dataset.id);
        city_id_selected.push(id_as_integer);
    }
    array_each(city_selected_dom, callback_add_cityID);

    const universities = [];
    for (let i = 0; i < city_id_selected.length; i++) {
        const city_id = city_id_selected[i];
        for (let ii = 0; ii < UNIVERSITIES.length; ii++) {
            const university = UNIVERSITIES[ii];
            if (university.cityID === city_id) {
                universities.push(university);
            }
        }
    }

    let programmes = [];
    function callback_add_programmes(university) {
        const university_id = university.id;
        for (let i = 0; i < PROGRAMMES.length; i++) {
            const programme = PROGRAMMES[i];
            if (programme.universityID === university_id) {
                programmes.push(programme);
            }
        }
    }
    array_each(universities, callback_add_programmes);



    const level_selected_dom = document.querySelectorAll("#level_filter li.selected");
    const level_id_selected = [];
    function callback_add_levelID(dom_element) {
        const id_as_integer = parseInt(dom_element.dataset.id);
        level_id_selected.push(id_as_integer);
    }
    array_each(level_selected_dom, callback_add_levelID);

    function test_function_level(programme) {
        return level_id_selected.includes(programme.levelID);
    }
    programmes = array_filter(programmes, test_function_level);



    const language_selected_dom = document.querySelectorAll("#language_filter li.selected");
    const language_id_selected = [];
    function callback_add_languageID(dom_element) {
        const id_as_integer = parseInt(dom_element.dataset.id);
        language_id_selected.push(id_as_integer);
    }
    array_each(language_selected_dom, callback_add_languageID);



    function test_function_language(programme) {
        return language_id_selected.includes(programme.languageID);
    }
    programmes = array_filter(programmes, test_function_language);



    const subject_selected_dom = document.querySelectorAll("#subject_filter li.selected");
    const subject_id_selected = [];
    function callback_add_subjectID(dom_element) {
        const id_as_integer = parseInt(dom_element.dataset.id);
        subject_id_selected.push(id_as_integer);
    }
    array_each(subject_selected_dom, callback_add_subjectID);



    function test_function_subject(programme) {
        return subject_id_selected.includes(programme.subjectID);
    }
    programmes = array_filter(programmes, test_function_subject);



    const search_string = document.querySelector("#search_field input").value;
    if (search_string !== "") {
        function test_function(programme) {
            return programme.name.includes(search_string);
        }
        programmes = array_filter(programmes, test_function);
    }

    return programmes;
}

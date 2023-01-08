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


// VG
// CODE according to specification
function add_group_toggling(filter_container_dom) {

    /*
      ARGUMENT
        filter_container_dom: reference to a HTML-element that contains a set of fliter_elements
              Exempel: the <ul> that contains the filters for Language.
  
      SIDE EFFECTS
        The function makes sure that when the user clicks on filter_container_dom, all the
        filter_elements that it contains are selected / unselected.
        Since some filter elements will have changed after the click, the list of
        programmes must be updated.
  
      NO RETURN VALUE
  
    */

}


// VG
// CODE according to specifications
function toggle_cities(event) {

    /*
  
      ARGUMENTS
        This function does not take any arguments
  
      SIDE EFFECTS
        This function checks the state of the first city-filter-element (Madrid).
        If it is selected then it de-selects ALL city-filter-elements
        If it is de-selected then it selects ALL city-filter-elements 
  
      NO RETURN VALUE
  
    */

}


// WRITE SPECIFICATION
// ATTENTION: You need to write the specification of all three functions:
//            create_countries_cities_filters, create_country and create_city

/*
NO ARGUMENTS

SIDE EFFECTS 
create dom-elements (countries and cities filters)

NO RETURN
*/
function create_countries_cities_filters() {

    /*
ARGUMENTS
country: to grab the id of the country and put it as an id for the element

SIDE EFFECTS
creates dom-element and adds two classnames
adds an id to the dom-element, the id is taken from the argument.
Appends the dom-element to an ul-element that has parent-element with the id country_filter
Sets the dom-element to the html, country.name inside <h1> and ul with classname filter_list
RETURN
*/
    function create_country(country) {
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

NO RETURN
*/
    function create_city(city) {

        const dom = create_filter_element({
            parent: document.querySelector(`#country_${city.countryID} > ul`),
            class: "selected",
            textContent: city.name,
        });
        dom.dataset.id = city.id;

    }

    array_each(COUNTRIES, create_country);
}


// G
// ABSTRACT AND WRITE SPECIFICATION
//    As you can see, all three functions below do basically the same thing.
//    Abstract them to one function, and write the specification of that function.

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
// Create Subjects Filter
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
// Create Search Field
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


// G
// WRITE SPECIFICATION
// You must understand how this function works. There will be questions about it
// in the code review (kodredovisning)
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

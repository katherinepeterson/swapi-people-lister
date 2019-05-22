/*
The following function grabs the first 4 pages of data instead of using the next method to grab the next page. 
So it doesn't actually grab all of the data but the page runs much faster using this function.
I also could use Promise.all with this method, and I couldn't with the next method.

async function fetchPeople() {
    const response = fetch('https://swapi.co/api/people/');
    const response2 = fetch('https://swapi.co/api/people/?page=2');
    const response3 = fetch('https://swapi.co/api/people/?page=3');
    const response4 = fetch('https://swapi.co/api/people/?page=4');
    const responses = [response, response2, response3, response4];
    const allResponses = await Promise.all(responses);
    const page1 = await allResponses[0].json();
    const page2 = await allResponses[1].json();
    const page3 = await allResponses[2].json();
    const page4 = await allResponses[3].json();
    const responseArr = [];
    responseArr.push(...page1.results, ...page2.results, ...page3.results, ...page4.results);
    return responseArr;
}
*/

/*
The function below will grab all of the data from the Star Wars api using a while loop and the next method.
I couldn't use Promise.all with it and it runs slower. 
So, the function below grabs more data but performance is better with the function above. 
*/

// It's often good practice to define your data type first by setting something (i.e. allData) equal to something blank to begin with .  Here, you might set allData equal to an empty array, so the user knows what will be defined later on.  Also, it avoids certain errors later in projects.
let allData; 

async function fetchPeople() {
    let response = await fetch('https://swapi.co/api/people/');
    let data = await response.json();
    const responseArr = [...data.results];
    // ABSOLUTELY EXCELLENT use of a while loop in a practical way to loop through all possible responses!
    while (data.next !== null) {
        response = await fetch(data.next);
        data = await response.json();
        responseArr.push(...data.results);
    }
    
    return responseArr;
}

async function getData(){
    allData = await fetchPeople();
}

getData();

const leftDiv = document.getElementById('left');
const rightDiv = document.getElementById('right');

async function populateLeftDiv() {
    const data = await fetchPeople();
    leftDiv.innerHTML = `<ul>${data.map(function(el, i){
        return `<li id='${i}'>${el.name}</li>`;
    }).join('')}</ul>`;
}
populateLeftDiv();

leftDiv.addEventListener('click', async function(ev){
    //let data = await fetchPeople();
    const listItems = Array.from(document.getElementsByTagName('LI'));
    if (ev.target.tagName === 'LI') {
        listItems.forEach(function(el){
            el.style = 'font-weight:normal';
        }) 
        ev.target.style = 'font-weight:bold';
        let person = allData[ev.target.id];
        rightDiv.innerHTML = `
        <p><b>Name:</b> ${person.name}</p>
        <p><b>Height:</b> ${person.height}</p>
        <p><b>Mass:</b> ${person.mass}</p>
        <p><b>Hair Color:</b> ${person.hair_color}</p>
        <p><b>Skin Color:</b> ${person.skin_color}</p>
        <p><b>Eye Color:</b> ${person.eye_color}</p>
        <p><b>Birth Year:</b> ${person.birth_year}</p>
        <p><b>Gender:</b> ${person.gender}</p>
        <p><b>Homeworld:</b> ${person.homeworld}</p>
        <p><b>Created:</b> ${person.created}</p>
        <p><b>Edited:</b> ${person.edited}</p>
        <p><b>Url: ${person.url}</p>
        `;
    }
})
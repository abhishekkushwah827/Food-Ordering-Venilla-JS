let mainDiv = document.querySelector("#main");
let selectSortby = document.querySelector("#dropdown-SortBy");
let selectFilter = document.querySelector("#dropdown-Filter");
let search_input = document.querySelector("#search_input");

const getData = () => fetch("./api/hotels.json").then(res => res.json());

const generateHotelCard = (hotel) => {
    let a = JSON.parse(localStorage.getItem("fav"));
    if (a !== null) {
        var favIconClass = a.find(h => h.id === hotel.id) ? "fav_id" : "not_fav_id";
    }
    else {
        var favIconClass = "not_fav_id";
    }

    let card =
        `<div class="col-md-3 mb-4">
        <div class="card hotel">
        <img src="${hotel.img}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${hotel.name}</h5>
                <span class="text-muted tags">${hotel.tags.join(", ")}</span>
               <a id="${favIconClass}" onClick="markFavourite(this,${hotel.id})"><i class="fa fa-heart"></i></a>
                <div class="d-flex justify-content-between align-items-center mt-2">
                     <div class="rating">
                         <span class="fa fa-star checked" > ${hotel.rating} </span>
                     </div>
                     <span class="text-muted">${hotel.eta}  MINs</span>
                     <a class="btn btn-sm btn-success">Order Now</a>
                </div>
            </div>
        </div>
        </div>`

    return card;
}

const generateUI_hotels = (hotels) => hotels.map(hotel => generateHotelCard(hotel));

const Render_Ui = () => {
    getData().then(data => {
        allHotelsDataCopy = JSON.parse(JSON.stringify(data));
        mainDiv.innerHTML = generateUI_hotels(data).join("");
    });
}
Render_Ui();

const searchResult = () => {
    console.log("called");
    let str = search_input.value;
    let searchResult = allHotelsDataCopy.filter(hotels => hotels.tags.toString().toUpperCase().indexOf(str.toUpperCase()) > -1);
    mainDiv.innerHTML = generateUI_hotels(searchResult).join("");
}

const debounce = (fn, delay) => {
    let timer;
    return function () {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn();
        }, delay);
    }
}
const search = debounce(searchResult, 400);

selectSortby.addEventListener("click", e => {
    if (e.target.innerHTML == "Rating") {
        let sortedByRating = allHotelsDataCopy.sort((hotel1, hotel2) => hotel2.rating - hotel1.rating);
        mainDiv.innerHTML = generateUI_hotels(sortedByRating).join("");
    }
    else {
        let sortedByETA = allHotelsDataCopy.sort((hotel1, hotel2) => hotel1.eta - hotel2.eta);
        mainDiv.innerHTML = generateUI_hotels(sortedByETA).join("");
    }
})
selectFilter.addEventListener("click", e => {
    let val = e.target.innerHTML;
    let filterHotels = allHotelsDataCopy.filter(data => data.tags.toString().toUpperCase().indexOf(val.toUpperCase()) > -1);
    mainDiv.innerHTML = generateUI_hotels(filterHotels).join("");
})


const markFavourite = (abc, id) => {
    if (!localStorage.getItem("fav")) {
        var a = [];
        localStorage.setItem("fav", JSON.stringify(a));
    }
    var a = [];
    a = JSON.parse(localStorage.getItem("fav"));
    let markedhotel = allHotelsDataCopy.filter(hotel => hotel.id === id);
   if (!a.find(hotel => hotel.id === id)) {
        a.push(...markedhotel);
        abc.setAttribute("style", "color: red !important;");
    } else {
        let index = a.indexOf(a.find(hotel => hotel.id === id));
        a.splice(index, 1);
        abc.setAttribute("style", "color: white !important;");
    }

    localStorage.setItem("fav", JSON.stringify(a));
}


const getMyFav = () => {
    let fav_hotels = JSON.parse(localStorage.getItem("fav"));
    mainDiv.innerHTML = generateUI_hotels(fav_hotels).join("");
}
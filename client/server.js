let text = document.querySelector("#text");
let search = document.querySelector("#search");
let data = document.querySelector("#data");

let loadData = () => {
    let url = "http://localhost:5000/ask";
    fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"word": text.value})
    }).then(res => res.json()).then(res => {
        console.log(res);
        data.innerHTML =
        `<div class="detail">
          <h3>${res.word}  (${res.pos})</h3>
         </div>
    
         <div class="detail">
             <h5 class="meaning">DEFINITION</h5>
             <p>${res.meaning}</p>
             <h5 class="meaning">USAGE</h5>
             <p>${res.message}</p>
         </div>`
    }
    ).catch(() => {
        data.innerHTML = `<div id="error">Can't find the meaning of ${text.value}</div>`;
    });
}

search.addEventListener("click", () => {
    if (text.value != "") {
        loadData();
    } else {
        data.innerHTML = `<div id="msg">Type a word and click on search</div>`;
    }
})
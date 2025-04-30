// try{
//     const response = await fetch("localhost:8000/");
//     const data = await response.json();

//     console.log(data);
// }
// catch(error){
//     console.error(error);
// }
try{
    fetch("http://localhost:8000/")
    .then(response => response.json())
    .then(data => {
        console.log(data);

        //add concert data from mongo to the DOM with javascript 
    })
}
catch(error){
    console.error(error);
}

const likeButtons = document.querySelectorAll('.likeButton');
const popupButton = document.querySelector('#popup');
const popupClose = document.querySelector('#popupClose');

likeButtons.forEach(button => {
    button.addEventListener('click', _ => {
        const concertName = button.id;
        
        fetch('/like', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({concert: concertName})
        })
        .then(response => {
            if(!response.ok){
                throw new Error(`HTTP error, status ${response.status}`);
            }
            return response.json();
        })
        .then(updatedValue => {
            document.querySelector(`#${concertName.replace(/\s+/g, '_')}_votes`).innerHTML = updatedValue;

            sortConcertList();
        })
        .catch(error => {
            console.error("Error updaing item:", error);
        })
    })
})

function sortConcertList(){
    let concertList = document.getElementById('concertListRanked');
    let concertListArr = Array.from(concertList.children);

    concertListArr.sort((a,b) => {
        const aVotes = a.querySelector('span[id$="_votes"]').textContent;
        const bVotes = b.querySelector('span[id$="_votes"]').textContent;
        return bVotes - aVotes;
    
    });

    concertListArr.forEach(item => concertList.appendChild(item));
}

popupButton.addEventListener('click', _ => {
    document.getElementById("overlay").style.display = "block";
    document.getElementById("popupInfo").style.display = "block";
});

popupClose.addEventListener('click', _ => {
    document.getElementById("overlay").style.display = "none";
    document.getElementById("popupInfo").style.display = "none";
})
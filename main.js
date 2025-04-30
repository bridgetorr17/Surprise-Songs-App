// try{
//     const response = await fetch("localhost:8000/");
//     const data = await response.json();

//     console.log(data);
// }
// catch(error){
//     console.error(error);
// }
try{
    fetch("https://surprise-songs.vercel.app/")
    .then(response => response.json())
    .then(data => {
        console.log(data);
        let list = document.getElementById('concertListRanked');
        //add concert data from mongo to the DOM with javascript 
        data.forEach((concert, index) => {
            let li = document.createElement('li');
            li.setAttribute('class', 'flex2');
            list.appendChild(li);

            let sec1 = document.createElement('section');
            sec1.setAttribute('class', 'flex1 concertLeft');
            li.appendChild(sec1);
            
            let h4 = document.createElement('h4');
            h4.innerHTML = concert.concertName;
            sec1.appendChild(h4);

            let span1 = document.createElement('span');
            span1.innerHTML = concert.guitarSong;
            sec1.appendChild(span1);

            let span2 = document.createElement('span');
            span2.innerHTML = concert.pianoSong;
            sec1.appendChild(span2);

            let sec2 = document.createElement('section');
            sec2.setAttribute('class', 'flex2 concertRight');
            li.appendChild(sec2);

            let img = document.createElement('img');
            img.setAttribute('id', concert.concertName);
            img.setAttribute('class', 'likeButton');
            img.setAttribute('src', '/images/hearts.png');
            img.setAttribute('alt', 'like button');
            sec2.appendChild(img);

            let span3 = document.createElement('span');
            span3.setAttribute('id', concert.concertName.replace(/\s+/g, '_') + '_votes');
            span3.setAttribute('class', 'bold');
            span3.innerHTML = concert.votes;
            sec2.appendChild(span3);
        })
    
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
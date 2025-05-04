//popup window logic and event listeners
const popupButton = document.querySelector('#popup');
const popupClose = document.querySelector('#popupClose');

popupButton.addEventListener('click', _ => {
    document.getElementById("overlay").style.display = "block";
    document.getElementById("popupInfo").style.display = "block";
});

popupClose.addEventListener('click', _ => {
    document.getElementById("overlay").style.display = "none";
    document.getElementById("popupInfo").style.display = "none";
})

//get page from server
try{
        fetch("https://surprise-songs.vercel.app")
        .then(response => response.json())
        .then(data => {
            //add concert data already existing in the DB
            data.forEach((concert) => {
                addElement(concert);
            });
        })
        .then(result => {
            //add event listeners for all concert like buttons
            const likeButtons = document.querySelectorAll('.likeButton');
            likeButtons.forEach(button => {
                addLikeButton(button);
            })
        })
    }
    catch(error){
        console.error(error);
    }

//concert form POST with JS (handled here to prevent entire page reload)
document.getElementById('concertForm').addEventListener('submit', async function(event){
    event.preventDefault();

    const formData = new FormData(event.target);
    const formDataObj = {};
    formData.forEach((value, key) => {
        formDataObj[key] = value;
    });

    try{
        const response = await fetch('https://surprise-songs.vercel.app/addConcert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataObj)
        });

        console.log(response);
        if(response.status === 201){
            formDataObj['votes'] = 0;
            document.getElementById('concertForm').reset();
            addElement(formDataObj);

            const button = document.querySelector('ul').querySelectorAll('img');
            buttonAdded = button[button.length-1]
            addLikeButton(buttonAdded);
            document.querySelector('#additionMessage').innerHTML = "Thank you for the contribution! Your concert has been added to the list 🫶🏻"
        }
        else if (response.status === 200){
            document.getElementById('concertForm').reset();
            console.log('concert was already there');
            document.querySelector('#additionMessage').innerHTML = "We already have that concert! Go ahead and vote for it down below ✨"
        }
        else if (response.status === 406){
            document.getElementById('concertForm').reset();
            console.log('mistake in the input');
            document.querySelector('#additionMessage').innerHTML = "Looks like you had a typo or tried to put in an invalid song. Try again?"
        }
    }
    catch(error){
        console.error(error);
    }
})

//sort concerts on client side after like (could make a new request to the server also)
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

//adding all HTML elements to concert list
function addElement(concert){

    let list = document.getElementById('concertListRanked');
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
    img.setAttribute('src', './images/hearts.png');
    img.setAttribute('alt', 'like button');
    sec2.appendChild(img);

    let span3 = document.createElement('span');
    span3.setAttribute('id', (concert.concertName.replace(/\s+/g, '_') + '_votes'));
    span3.setAttribute('class', 'bold');
    span3.innerHTML = concert.votes;
    sec2.appendChild(span3);
}

//event listener for like button
//where the PUT request is made to the server
function addLikeButton(button){
    button.addEventListener('click', _ => {
                    
        const concertName = button.id;
        
        fetch('https://surprise-songs.vercel.app/like', {
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
}


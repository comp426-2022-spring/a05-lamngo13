// Focus div based on nav button click

document.getElementById("homenav").onclick = function(){
  document. location. reload();
  document.getElementById("homenav").className = "active";
  document.getElementById("singlenav").className = "";
  document.getElementById("multinav").className = "";
  document.getElementByIdii("guessnav").className = "";

  document.getElementById("home").className = "";
  document.getElementById("single").className = "hidden";
  document.getElementById("multi").className = "hidden";
  document.getElementById("guess").className = "hidden";
};

document.getElementById("singlenav").onclick = function(){
  document.getElementById("homenav").className = "";
  document.getElementById("singlenav").className = "active";
  document.getElementById("multinav").className = "";
  document.getElementById("guessnav").className = "";

  document.getElementById("home").className = "hidden";
  document.getElementById("single").className = "";
  document.getElementById("multi").className = "hidden";
  document.getElementById("guess").className = "hidden";
};

document.getElementById("multinav").onclick = function(){
  document.getElementById("homenav").className = "";
  document.getElementById("singlenav").className = "";
  document.getElementById("multinav").className = "active";
  document.getElementById("guessnav").className = "";

  document.getElementById("home").className = "hidden";
  document.getElementById("single").className = "hidden";
  document.getElementById("multi").className = "";
  document.getElementById("guess").className = "hidden";
};

document.getElementById("guessnav").onclick = function(){
  document.getElementById("homenav").className = "";
  document.getElementById("singlenav").className = "";
  document.getElementById("multinav").className = "";
  document.getElementById("guessnav").className = "active";

  document.getElementById("home").className = "hidden";
  document.getElementById("single").className = "hidden";
  document.getElementById("multi").className = "hidden";
  document.getElementById("guess").className = "";
};

// Flip one coin and show coin image to match result when button clicked
function one_coin() {
  fetch('http://localhost:5555/app/flip/', {mode: 'cors'})
  .then(function(response) {
      return response.json();
  })
  .then(function(result) {
      console.log(result)
      document.getElementById("resultsingle").innerHTML = result.flip
      document.getElementById("quarter").src=`./assets/img/${result.flip}.png`
  })
}

// Flip multiple coins and show coin images in table as well as summary results
function flipCoins() {
  number_flips = document.getElementById("flipnumber").value;
  fetch('http://localhost:5555/app/flips/coins', {
      body: JSON.stringify({
          "number": number_flips
      }),
      headers: {
          "Content-Type": "application/json",
      },
      method: "post"
  })
      .then(function (response) {
          return response.json();
      })
      .then(function (result) {
          console.log(result);
          document.getElementById("num_heads").innerHTML = result.summary.heads;
          document.getElementById("num_tails").innerHTML = result.summary.tails;

          var detailsTableBody = document.getElementById("details");
          for (var i = 0; i < result.raw.length; i++) {
              var currentRow = document.createElement("tr");

              var currNumber = document.createElement("td");
              currNumber.innerHTML = i + 1;
              currentRow.appendChild(currNumber);

              var currResult = document.createElement("td");
              currResult.innerHTML = result.raw[i];
              currentRow.appendChild(currResult);

              var currImageCell = document.createElement("td");
              var currImageActual = document.createElement("img");
              currImageActual.setAttribute("src", "assets/img/" + result.raw[i] + ".png");
              currImageActual.setAttribute("class", "smallcoin");
              currImageCell.appendChild(currImageActual);
              currentRow.appendChild(currImageCell);

              detailsTableBody.appendChild(currentRow);
          }
          document.getElementById("results_tbl").setAttribute("class", "active");
      })
}

// Guess a flip by clicking either heads or tails button
function guess_flip(guess) {
  console.log(guess);
  fetch('http://localhost:5555/app/flip/call', {
      body: JSON.stringify({
          "guess": guess
      }),
      headers: {
          "Content-Type": "application/json",
      },
      method: "post"
  })
      .then(function (response) {
          return response.json();
      })
      .then(function(result) {
          console.log(result);

          document.getElementById("your_call").innerHTML = guess;
          document.getElementById("your_call_img").setAttribute("src", "assets/img/" + guess + ".png")

          document.getElementById("flip_result").innerHTML = result.flip;
          document.getElementById("flip_result_img").setAttribute("src", "assets/img/" + result.flip + ".png");

          document.getElementById("guess_result").innerHTML = "You " + result.result + ".";
      })
}

/*
IDK MAN TBH
const coin = document.getElementById('coin');

coin.addEventListener("click", flipCoin);

//big boy
async function flipCoin() {
    const endpoint = "app/flip/";
    const url = document.baseURI+endpoint
    //PI of A (API for u cultured folks)
    await fetch(url)
                        .then(function(response) {
                        return response.json();    
                        })

                            .then(function(result) {
                                console.log(result);
                                document.getElementById("result").innerHTML = result.flip;
				                document.getElementById("quarter").setAttribute("src", "assets/img/"+result.flip+".png");
                            });
};

const coins = document.getElementById("coins")
coins.addEventListener("submit", flipCoins)

//big chonker
async function flipCoins(event) {
    //this is cool I didn't know this!
    //we are using an event, and thus need to remove
    // the default browswer event - a reload!
    event.preventDefault();
    const endpoint = "app/flip/coins/"
    const url = document.baseURI+endpoint
    const formEvent = event.currentTarger

    //this can fail so we want to TRY
    try {
            const formData = new FormData(formEvent);
            const flips = await sendFlips({url, formData});
            console.log(flips);
            document.getElementById("heads").innerHTML = "Heads: "+flips.summary.heads;
		    document.getElementById("tails").innerHTML = "Tails: "+flips.summary.tails;
        document.getElementById("coinlist").innerHTML = coinList(flips.raw);
    } catch (error) {
        console.log(error);
    }
}
//end big chonker

const call = document.getElementById("")
call.addEventListener("submit", flipCall)

//start the chonker
async function flipCall(event) {
    event.preventDefault();
    const endpoint = "app/flip/call/"
    const url = document.baseURI+endpoint
    const formEvent = event.currentTarget
    try {
            const formData = new FormData(formEvent);
            const results = await sendFlips({url, formData});
            console.log(results);

            document.getElementById("choice").innerHTML = "Guess: "+results.call;
		document.getElementById("actual").innerHTML = "Actual: "+results.flip;
		document.getElementById("results").innerHTML = "Result: "+results.result;
// Assemble a list containing images corresponding to the game results
    document.getElementById("coingame").innerHTML = '<li><img src="assets/img/'+results.call+'.png" class="bigcoin" id="callcoin"></li><li><img src="assets/img/'+results.flip+'.png" class="bigcoin"></li><li><img src="assets/img/'+results.result+'.png" class="bigcoin"></li>';
	} catch (error) {
		console.log(error);
	}
}
//end chonker

//start new chonker
async function sendFlips({url, formData}) {
    const plainFormData = Object.fromEntries(formData.entries());
    const formDataJson = JSON.stringify(plainFormData);
    console.log(formDataJson);

    const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json"
		},
		body: formDataJson
	};

    const response = await fetch(url, options);
	return response.json()
}
//end chonker

//NAVIGATION BUTTONS:
function homeNav() {
    document.getElementById("homenav").className = "active";
    document.getElementById("home").className = "active";
    document.getElementById("singlenav").className = "";
    document.getElementById("single").className = "inactive";
    document.getElementById("multinav").className = "";
    document.getElementById("multi").className = "inactive";
    document.getElementById("guessnav").className = "";
    document.getElementById("guesscoin").className = "inactive";
  }
  function singleNav() {
    document.getElementById("homenav").className = "";
    document.getElementById("home").className = "inactive";
    document.getElementById("singlenav").className = "active";
    document.getElementById("single").className = "active";
    document.getElementById("multinav").className = "";
    document.getElementById("multi").className = "inactive";
    document.getElementById("guessnav").className = "";
    document.getElementById("guesscoin").className = "inactive";
  }
  function multiNav() {
    document.getElementById("homenav").className = "";
    document.getElementById("home").className = "inactive";
    document.getElementById("singlenav").className = "";
    document.getElementById("single").className = "inactive";
    document.getElementById("multinav").className = "active";
    document.getElementById("multi").className = "active";
    document.getElementById("guessnav").className = "";
    document.getElementById("guesscoin").className = "inactive";
  }
  function guessNav() {
    document.getElementById("homenav").className = "";
    document.getElementById("home").className = "inactive";
    document.getElementById("singlenav").className = "";
    document.getElementById("single").className = "inactive";
    document.getElementById("multinav").className = "";
    document.getElementById("multi").className = "inactive";
    document.getElementById("guessnav").className = "active";
    document.getElementById("guesscoin").className = "active";
  } 
//end nav buttons

// Make a list of coin images
// This function takes an array of coin flip results and turns them into list elements with corresponding images.
// This allows the DOM call above to put the list in the appropriate place and show a coin for each of the flips sent back from the server.
function coinList(array) {
    let text = "";
    let arrayLength = array.length
    for (let i = 0; i < arrayLength; i++) {
      text += '<li><img src="assets/img/'+array[i]+'.png" class="bigcoin"></li>';
    }
    return text
  }
*/

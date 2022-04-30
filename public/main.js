// Focus div based on nav button click
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
    //still inside the chonker

    }
//end big chonker


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


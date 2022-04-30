// Focus div based on nav button click
const coin = document.getElementById('coin');

coin.addEventListener("click", flipCoin);

//big boy
async function flipCoin() {
    const endpoint = "app/flip/";
    const url = document.baseURI+endpoint;
    //PI of A (API for u cultured folks)
    await fetch(url);
                        .then(function(response) {
                        return response.json();    
                        })
}
//end big boy
// Flip one coin and show coin image to match result when button clicked

// Flip multiple coins and show coin images in table as well as summary results
// Enter number and press button to activate coin flip series

// Guess a flip by clicking either heads or tails button

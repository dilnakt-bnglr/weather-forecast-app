let searchBtn=document.querySelector('.search-button');
searchBtn.addEventListener("click",handleSearch);

function handleSearch(){
    const cityInput=document.querySelector(".location-input");
    const cityName=cityInput.value;
    console.log(cityName);
    if(cityName===""){
        const searchDiv=document.querySelector(".search");
        const errorMsg=document.createElement("p");
        errorMsg.classList.add("error");
        errorMsg.innerHTML="Please enter a city name";
        const error=document.querySelector(".error");
        if(!error){
            searchDiv.appendChild(errorMsg);
        }
        
    }
    
        
}
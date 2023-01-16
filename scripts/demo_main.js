// ta funkcja będzie czekała z wykonaniem kodu w elsie aż mój skrypt nie określi czy połączono czy nie - inaczej występowały problemy
function waitForLoaded() {
    if(planZSLapi.polaczono === undefined) {
        window.setTimeout(waitForLoaded, 100);
    } else {
        // tu wrzuć cały kod wykorzystujący skrypt planZSLapi. Zasadniczo powinny się wyświetlać też w trakcie pisania informacje o dostępnych funckjach planZSLapi i takich tam, jak i ich dokumentacja
        if(planZSLapi.polaczono){
            planZSLapi.wyswietlOpcje($('#kategoria').val(),'#opcja')
            planZSLapi.wyswietlPlan($('#kategoria'),$('#opcja'),'.r','.c',false)
            //jeśli chcesz podmienić szablon lekcji wyświetlanych w komórkach tabeli, śmiało looknij do scripts/apiIntegration.js na linijkę 147
            
        }else{
            console.error(planZSLapi.blad)
        }
    }
}
waitForLoaded();
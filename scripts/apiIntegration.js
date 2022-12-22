var planZSLapi = {}

window.onload = function() {
    if (!window.jQuery) {  
        planZSLapi.polaczono = false;
        planZSLapi.blad = "Nie zaimportowano jQuery.";
    } else {

        $.ajax({
            url:"https://plan-ZSL-api.herokuapp.com/plan",
            type:"GET",
            success: (data)=>{
                $.extend(planZSLapi,data)
                planZSLapi.polaczono = true;
            },
            error: ()=>{
                planZSLapi.polaczono = false;
                planZSLapi.blad = "Nie można połączyć z API.";
            }
        })
    }
}

/**
 * @description Wstawia opcje wyświetlania planu w formie <option value="wartość">Nazwa</option> do elementu podanym selektorze.   
 * @param {('klasy'|'sale'|'nauczyciele'|'przedmioty')} kategoria wskazuje spośród której kategorii wyświetlić opcje - Klas, Sal, Nauczycieli czy Przedmiotów.
 * @param {string} divId selektor elementu, do którego mają zostać wstawione opcje.
 */
planZSLapi.wyswietlOpcje = (kategoria,selektor)=>{
    if(!planZSLapi.polaczono){
        console.error(`Nie można połączyć się z API!`)
        return
    }else if(!["klasy","sale","nauczyciele","przedmioty"].includes(kategoria)){
        console.error(`Kategoria "${kategoria}" nie jest jedną z dostępnych opcji! (dostępne opcje: "klasy", "sale", "nauczyciele", "przedmioty")`)
        return
    }else if(document.querySelector(selektor)==null){
        console.error(`Nie znaleziono elementu o selektorze ${selektor}.`)
        return
    }
    $(selektor).html('')
    switch(kategoria){
        case "klasy":
            for(el of planZSLapi.klasy){
                $(selektor).append(`<option value="${el.id}">${el.class}</option>`)
            }
            break;
        case "sale":
            for(el of planZSLapi.sale){
                $(selektor).append(`<option value="${el}">${el}</option>`)
            }
            break;
        case "nauczyciele":
            for(el of planZSLapi.nauczyciele){
                $(selektor).append(`<option value="${el}">${el}</option>`)
            }
            break;
        case "przedmioty":
            for(el of planZSLapi.przedmioty){
                $(selektor).append(`<option value="${el}">${el}</option>`)
            }
            break;
    }
}

/**
 * @description Zwraca jedynie lekcje planu w JSONie zawiarające wybraną opcję.
 * @param {('klasy'|'sale'|'nauczyciele'|'przedmioty')} kategoria Wskazuje z której kategorii pochodzi opcja - Klas, Sal, Nauczycieli, czy Przedmiotów.
 * @param {string} opcja Kryterium według ktorego przeszukiwany jest plan.
 */
planZSLapi.filtrujPlan = (kategoria,opcja)=>{
    if(!planZSLapi.polaczono){
        console.error(`Nie można połączyć się z API!`)
        return
    }else if(!["klasy","sale","nauczyciele","przedmioty"].includes(kategoria)){
        console.error(`Kategoria "${kategoria}" nie jest jedną z dostępnych opcji! (dostępne opcje: "klasy", "sale", "nauczyciele", "przedmioty")`)
        return
    }
    let data = new Array();
    switch(kategoria){
        case "klasy":
            for(el of planZSLapi.plan){
                if(el.classId==opcja){
                    for(lesson of el.lessons){
                        data.push(lesson)
                    }
                }
            }
            break;
        case "sale":
            for(el of planZSLapi.plan){
                for(lesson of el.lessons){
                    if(lesson.classroom==opcja){
                        data.push(lesson)
                    }
                }
            }
            break;
        case "nauczyciele":           
            for(el of planZSLapi.plan){
                for(lesson of el.lessons){
                    if(lesson.teacher==opcja){
                        data.push(lesson)
                    }
                }
            }
            break;
        case "przedmioty":
            for(el of planZSLapi.plan){
                for(lesson of el.lessons){
                    if(lesson.subject==opcja){
                        data.push(lesson)
                    }
                }
            }
            break;
    }        
    return data;
}

/**
 * @description Wstawia plan lekcji do podanego elementu na podstawie wybranej opcji wyświetlania.
 * @param {string} selektorKategoria selektor pola, W którym wybrana jest kategoria opcji do wyświetlenia (Klasy/Sale/Nauczyciele).
 * @param {string} selektorOpcja selektor pola, W którym wybrana jest opcja do wyświetlenia w planie. (Klasy/Sale/Nauczyciele).
 * @param {string} prefiksRzad początek selektora wskazującego element zawierający kolumny (np. <tr> zawierający <td>). Każdy element będzie szukany za pomocą selektora w postaci prefiksRzad#, gdzie # oznacza dostawiony przez funkcję indeks rzędu (1-15, oznaczający numer jednostki lekcyjnej).
 * @param {string} prefiksKolumna początek selektora wskazującego element kolumny. Każdy element będzie szukany za pomocą selektora w postaci prefiksKolumna#, gdzie # oznacza dostawiony przez funkcję indeks kolumny (1-5, oznaczający dni tygodnia od poniedziałku do piątku).
 * @param {boolean} zamien Domyślnie false. Jeżeli ustawione na true, dni tygodnia będą wyświetlać się w rzędach, a numery jednostek lekcyjnych w kolumnach. Zaleca się używać tych samych typów selektorów, np. klas, zarówno w rzędach jak i kolumnach
*/
planZSLapi.wyswietlPlan = function (selektorKategoria,selektorOpcja,prefiksRzad,prefiksKolumna,zamien=false){
    let data = this.filtrujPlan($(selektorKategoria).val(),$(selektorOpcja).val())
    if(zamien){
        [prefiksKolumna,prefiksRzad]=[prefiksRzad,prefiksKolumna]
        for(i=1;i<=5;i++){
            for(j=1;j<=15;j++){
                $(prefiksRzad+i+" "+prefiksKolumna+j).html('')
            }
        }
    }else{
        for(i=1;i<=15;i++){
            for(j=1;j<=5;j++){
                $(prefiksRzad+i+" "+prefiksKolumna+j).html('')
            }
        }
    }
    
    for(el of data){

        //TODO: Zmiana poniższej struktury [Pixoni jeśli to czytasz - poniższą linijkę śmiało edytuj ^^]
        let lekcja = `<div>${el.subject}<br>${el.group}<br>${el.teacher}<br>${el.classroom}</div>`
        
        if(!$(prefiksRzad+el.unit+" "+prefiksKolumna+el.day).html().includes(lekcja)){
            if($(prefiksRzad+el.unit+" "+prefiksKolumna+el.day).html()==''){
                $(prefiksRzad+el.unit+" "+prefiksKolumna+el.day).append(lekcja)
            }else{
                $(prefiksRzad+el.unit+" "+prefiksKolumna+el.day).append("<br>"+lekcja)
            }
        }
    }
}
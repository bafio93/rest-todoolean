$(document).ready(function(){
    // Inizio cercando di stampare a schermo la mia lista.
    stampa_lista();
    // Ora cerco di aggiungere dei nuovi elementi alla lista.
    // Intercetto l'inserimento di un nuovo elemento nel campo input:
    posta_nuovo();
});

// FUNZIONI:

// FUNZIONE DI STAMPA DELLA LISTA:
function stampa_lista(){
    $("#lista").empty();
    $.ajax ({
        "url": "http://157.230.17.132:3019/todos",
        "method":"GET",
        "success": function(data_success){
            compila_lista(data_success);
        },
        "error": function(){
            alert("ERROR! -.-");
        }
    });
}


// FUNZIONE PER COMPILARE LA LISTA:
function compila_lista(data_success){
    //
    console.log(data_success);
    for (var i = 0; i < data_success.length; i++) {
        console.log(data_success[i].text);
        var template_html = $("#template_lista").html();
        var template_function = Handlebars.compile(template_html);
        var variabili = {
            oggetto_lista: data_success[i].text
        };
        var html_finale = template_function(variabili);
        $("#lista").append(html_finale);
    }
    //
}


// FUNZIONE PER AGGIUNUNGERE UN NUOVO ELEMENTO:
function posta_nuovo(){
    $("input").change(function(){
        var nuovo_oggetto = $("input").val();
        if (nuovo_oggetto.length > 0) {
            //Ora chiamo con metodo post:
            $.ajax ({
                "url": "http://157.230.17.132:3019/todos",
                "method":"POST",
                "data": {
                    "text":nuovo_oggetto
                }
            });
            $("input").val("");
            stampa_lista();
        }
    });
}

// FUNZIONE CALENDARIO
function compila_calendario(mese) {
    // Come prima cosa, svuotiamo <ul> ed <h1>:
    $("h1").empty();
    $("ul").empty();
    button_eraser(mese);
    // Componiamo ora la data:
    var data_iniziale = "2018-"+mese;
    var moment_iniziale = moment(data_iniziale);
    // Quanti giorni ha il mese?
    var lunghezza_mese = moment_iniziale.daysInMonth();
    // Stampa a schermo il mese.
    for (var i = 1; i <= lunghezza_mese; i++) {
        // Mettiamolo in template handlebars
        // Inizializzo il template handlebars
        var data_processata = moment(data_iniziale+"-"+i);
        var template_html = $("#template_giorno").html();
        var template_function = Handlebars.compile(template_html);
        var variabili = {
            day: data_processata.format("Do")
        };
        var html_finale = template_function(variabili);
        $("#calendario").append(html_finale);
    };
    // Setto titolo come mese corrente.
    $("h1").append(moment_iniziale.format("MMMM"));
};

// FUNZIONE CHE DISATTIVA PREV E NEXT IN CERTI CASI
function button_eraser(mese){
    $("button").removeClass("disattivato");
    if (mese == 01) {
        $("button#prev").addClass("disattivato");
    } else if (mese == 12) {
        $("button#next").addClass("disattivato");
    }
};

// FUNZIONE AJAX: CHECK
function ajax_check(mese){
    $.ajax ({
        "url": "https://flynn.boolean.careers/exercises/api/holidays?year=2018&month="+(mese - 1), // Cambiare month per adattarlo al formato di moment.
        "method":"GET",
        "success": function(data_success){
            //
            for (var j = 0; j < data_success.response.length; j++) {
                var data_festiva = moment(data_success.response[j].date);
                $("li").each(function() {
                    // Traduco questo ciclo: se la data selezionata corrisponde a una di quelle festive, fai qualcosa, altrimenti no!
                    if (($(this).text())==(data_festiva.format("Do"))) {
                        $(this).addClass("festive");
                        var data_risultante = data_festiva.format("Do") + " -> " + data_success.response[j].name;
                        $(this).text(data_risultante);
                    }
                });
            }
            //
        },
        "error": function(){
            alert("ERROR! -.-");
        }
    })
}

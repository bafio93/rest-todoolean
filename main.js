$(document).ready(function(){
    // Inizio cercando di stampare a schermo la mia lista.
    stampa_lista();
    // Intercetto l'inserimento di un nuovo elemento nel campo input:
    posta_nuovo();
    // Ora permetto all'utente di eliminare l'elemento cliccato:
    elimina_elemento();
    // Ora permetto all'utente di modificare l'elemento cliccato:
    modifica_elemento();
    // Piccola parte di interfaccia utente!
    $("input").focus(function(){
        $("strong").addClass("support");
    });
    $("input").blur(function(){
        $("strong").removeClass("support");
    });
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
    for (var i = 0; i < data_success.length; i++) {
        var template_html = $("#template_lista").html();
        var template_function = Handlebars.compile(template_html);
        var variabili = {
            oggetto_lista: data_success[i].text,
            data_id: data_success[i].id
        };
        var html_finale = template_function(variabili);
        $("#lista").append(html_finale);
    }
    //
}


// FUNZIONE PER AGGIUNUNGERE UN NUOVO ELEMENTO:
function posta_nuovo(){
    $("input.new").change(function(){
        var nuovo_oggetto = $("input.new").val();
        if (nuovo_oggetto.length > 0) {
            // Ora chiamo con metodo post:
            $.ajax ({
                "url": "http://157.230.17.132:3019/todos",
                "method":"POST",
                "data": {
                    "text":nuovo_oggetto
                }
            });
            $("input.new").val("");
            stampa_lista();
            $("strong").removeClass("support");
        }
    });
}


// FUNZIONE PER ELIMINARE UN ELEMENTO:
function elimina_elemento() {
    $("#lista").on("click","i.fa-trash-alt",function(){
        // FUNZIONA! ORA CERCHIAMO DI ELIMINARE L'ELEMENTO SELEZIONATO
        to_do_id = $(this).parent("li").attr("data-id");
        $.ajax ({
            "url": "http://157.230.17.132:3019/todos/"+to_do_id,
            "method":"DELETE",
            "success": function(data_success){
                stampa_lista();
            },
            "error": function(){
                alert("ERROR! -.-");
            }
        });
    })
}


// FUNZIONE PER MODIFICARE UN ELEMENTO:
function modifica_elemento() {
    $("#lista").on("click","i.fa-pencil-alt",function(){
        // Prendo l'id dell'elemento cliccato:
        to_do_id = $(this).parent("li").attr("data-id");
        // Piccole accortezza stilistiche:
        $("input.modify").removeClass("support");
        $("input.new").addClass("support");
        $(this).parent("li").addClass("support");
        // Intercetto il valore nel campo modify:
        $("input.modify").change(function(){
            var nuovo_oggetto = $("input.modify").val();
            if (nuovo_oggetto.length > 0) {
                // Ora chiamo con metodo patch:
                $.ajax ({
                    "url": "http://157.230.17.132:3019/todos/"+to_do_id,
                    "method":"PATCH",
                    "data": {
                        "text":nuovo_oggetto
                    },
                    "success": function(data_success){
                        stampa_lista()
                    }
                });
                // Svuotiamo il campo e resettiamo tutte le classi:
                $("input.modify").val("");
                $("strong").removeClass("support");
                $("input.modify").addClass("support");
                $("input.new").removeClass("support");
                $(this).parent("li").removeClass("support");
            }
        });
    })
}

$(document).ready(function(){
    // Inizio cercando di stampare a schermo la mia lista.
    stampa_lista();
    // Intercetto l'inserimento di un nuovo elemento nel campo input:
    posta_nuovo();
    // Ora permetto all'utente di eliminare l'elemento cliccato:
    elimina_elemento();
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
    $("input").focus(function(){
        $("strong").addClass("support");
    })
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

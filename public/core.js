/* Initialize click handlers on page load */
$( document ).ready(function() {
    
    var auth_token = getHashValue("access_token");

    /* Redirect to login if there is no token */
    if (auth_token == null) {
        window.location.replace(window.location.origin);
    }

    /* Persistent list of search results that accumulates values */
    var search_results = [];

    /*********************************************
     *************** SEARCH BUTTON ***************
     *********************************************/
    $("#search_button").click(function (event) {

        /* Retrieve the search string and properly encode it */
        var track_string = $("#song_name").val();
        var track_uri = encodeURIComponent(track_string);
        if (track_uri != "") {

             /* Perform a Spotify GET request with the information in the query */
            var parameters = {
                q: track_uri,
                type: "track",
                market: "from_token",
                /* Limit set for temporary readability */
                limit: 3
            };


            var spotify_search = new XMLHttpRequest();

            /* When a response is received, add the search results to the search_results div and
             * to the persistent search_results object locally */
            spotify_search.addEventListener("load", function() {
                let results = JSON.parse(this.responseText);

                /* Build a list of results */
                var tracks = results.tracks.items;
                for (entry in tracks) {

                    search_results.push(tracks[entry]);
                    $("#search_results").append('<li class="list-group-item list-group-item-action">' + tracks[entry].name + '</li>');
                }

            });

            /* Open request and set authorization header */
            spotify_search.open("GET", "https://api.spotify.com/v1/search?" + $.param(parameters));
            spotify_search.setRequestHeader("Authorization", "Bearer " + auth_token);

            spotify_search.send();

        }
    });

    /****************************************
     ********** LOAD NEARBY QUEUES **********
     ****************************************/
    update_queues();


    $('#queue_form').submit(function(e){
        e.preventDefault();
        var post_send = $.ajax({
            url:'/home',
            type:'post',
            data:$('#queue_form').serialize()
        });
        post_send.done(update_queues());
        $('#new_queue').val("");
    });

});


/* Source: https://stackoverflow.com/questions/11920697/how-to-get-hash-value-in-a-url-in-js */
function getHashValue(key) {
  var matches = window.location.hash.match(new RegExp(key+'=([^&]*)'));
  return matches ? matches[1] : null;
}


/****************************************
 ********** LOAD NEARBY QUEUES **********
 ****************************************/
function update_queues() {

    var queue_retrieval = new XMLHttpRequest();
    queue_retrieval.addEventListener("load", function() {

        let results = this.responseText;
        $("#queue_results").html(results);

    });

    queue_retrieval.open("GET", "/nearby");
    queue_retrieval.send();
}

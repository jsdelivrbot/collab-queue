/* Initialize click handlers on page load */
$( document ).ready(function() {
    /* Eventually want to for loop here to add elements from database side */
    $( "#login_button" ).click( function( event ) {

        /* Redirect the user to log in with Spotify */
        var redirect_uri = encodeURIComponent(window.location.href + "home");
        window.location.replace("https://accounts.spotify.com/authorize?" +
                                "client_id=4786adfb1fde4f13abdb9e20c249128a&" +
                                "redirect_uri=" + redirect_uri + "&" +
                                "scope=user-read-private%20user-read-email&" +
                                "response_type=token&state=123");

    });
});
;(function() {
    var config = {
        apiKey: "AIzaSyCsSqV29twQ28VXeMSH951hNRq1Z_6x1GM",
        authDomain: "jschat-4b364.firebaseapp.com",
        databaseURL: "https://jschat-4b364.firebaseio.com",
        storageBucket: "jschat-4b364.appspot.com"
    };
    firebase.initializeApp(config);

    var database = firebase.database()
    var loginBtn = document.getElementById('start-login')
    var user = null
    var usuariosConectados = null
    var conectadoKey = ""
    var rooms

    loginBtn.addEventListener("click", googleLogin)
    window.addEventListener("unload", unlogin)

    function googleLogin () {
        var provider = new firebase.auth.GoogleAuthProvider()

        firebase.auth().signInWithPopup(provider)
            .then(function (result) {
                user = result.user
                $("#login").fadeOut()
                initApp()
            })
    }

    function initApp () {
        usuariosConectados = database.ref("/connected")

        rooms = database.ref("/rooms")

        login(user.uid, user.displayName || user.email)

        usuariosConectados.on("child_added", addUser)
        usuariosConectados.on("child_removed", removeUser)

        rooms.on("child_added", newRoom)
    }

    function login (uid, name) {
        var conectado = usuariosConectados.push({
            uid: uid,
            name: name
        })

        conectadoKey = conectado.key
    }

    function unlogin () {
        database.ref("/connected/" + conectadoKey).remove()
    }

    function addUser (data) {
        if (data.val().uid == user.uid) return
        var friend_id = data.val().uid

        var $li = $("<li>").addClass("collection-item")
                           .html(data.val().name)
                           .attr("id", friend_id)
                           .appendTo("#users")
        $li.on("click", function () {
            var room = rooms.push({
                creator: user.uid,
                friend: friend_id
            })

            //new Chat(room.key, user, "chats", database)
        })
    }

    function removeUser (data) {
        $("#" + data.val().uid).slideUp('fast', function () {
            $(this).remove()
        })
    }

    function newRoom (data) {
        if (data.val().friend == user.uid) {
            new Chat(data.key, user, "chats", database)
        }

        if (data.val().creator == user.uid) {
            new Chat(data.key, user, "chats", database)
        }
    }
})()
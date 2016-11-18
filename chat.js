class Chat {
    constructor (roomKey, user, containerID, database) {
        this.user = user
        this.id = roomKey
        this.database = database
        this.buildChat(containerID)
        this.setEvents()
    }

    buildChat (containerID) {
        $.tmpl($("#hidden-template"), { id: this.id })
            .appendTo("#" + containerID)
        this.ref = this.database.ref("/messages/" + this.id)
    }

    setEvents() {
        $("#" + this.id).find("form").on("submit", (ev) => {
            ev.preventDefault()

            var msg = $(ev.target).find(".mensaje").val()
            this.send(msg)
            $(ev.target).find(".mensaje").val("")

            return false
        })

        this.ref.on("child_added", (data) => this.add(data))
    }

    add(data) {
        var mensaje = data.val()
        var html = `
                    <b> ${ mensaje.name } :</b>
                    <span> ${ mensaje.msg } </span>
                   `
        var $li = $("<li>").addClass("collection-item")
                           .html(html)

        $("#" + this.id).find(".messages").append($li)
    }

    send(msg) {
        this.ref.push({
            name: this.user.displayName || this.user.email,
            roomID: this.id,
            msg: msg
        })
    }
}
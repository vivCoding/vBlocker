let accessDeniedMessage = $("#accessDenied")
let logTable = $("#logTable")

$("document", () => {
    logTable.hide()
    askPassword().then(success => {
        if (success) renderLogs()
        else accessDeniedMessage.show()
    })
})

function renderLogs() {
    accessDeniedMessage.hide()
    logTable.show()
    getLogs().then(data => {
        data.reverse().map(log => {
            let row = $('<tr></tr>')
                .append(`<td>${log.date}</td>`)
                .append(`<td>${log.time}</td>`)
                .append(`<td>${log.domain}</td>`)
                .append(`<td>${log.action}</td>`)
            logTable.append(row)
        })
    })
}
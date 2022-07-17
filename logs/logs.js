let accessDeniedMessage = $("#accessDenied")
let logTable = $("#logTable")

$("document", () => {
    logTable.hide()
    askPassword(success => {
        if (success) renderLogs()
        else accessDeniedMessage.show()
    })
})

function renderLogs() {
    accessDeniedMessage.hide()
    logTable.show()
    getLogs(data => {
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
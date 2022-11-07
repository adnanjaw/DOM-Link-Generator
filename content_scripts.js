$(document).ready(function () {
    setTimeout(function () {

        this.addJiraLink();

    }, 5000)
})

function addJiraLink() {
    var clientRefrenceFiled = document.evaluate(
        "/html/body/div[10]/div[2]/div/div[2]/div/div/div/div[3]/div[1]/div/div[2]/div[1]/div[1]/div/div/div[2]/div/div[3]/div[2]/div/div[1]/input",
        document.body);
    var clientRefrenceInput = clientRefrenceFiled.iterateNext();


    var contanier = document.evaluate(
        "/html/body/div[10]/div[2]/div/div[2]/div/div/div/div[3]/div[1]/div/div[2]/div[1]/div[1]/div/div/div[2]/div",
        document.body
    );
    var contanierDiv = contanier.iterateNext();

    if ($(clientRefrenceInput).val() !== '') {
        var href = "https://senet.atlassian.net/browse/" + $(clientRefrenceInput).val();
        var jiraLink = $('<a></a>').attr("href", href).append('<h3>Jirq Link</h3>');

        $(contanierDiv).append(jiraLink);
    }
}
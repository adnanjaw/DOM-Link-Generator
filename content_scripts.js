$(window).bind("load", function () {

    var jiralink = '';
    chrome.storage.local.get(['jiraLink'], (result) => {
        if (chrome.runtime.lastError)
            console.log('Error getting');

        jiralink = result.jiraLink;
    });

    setTimeout(function () {
        if (jiralink === '' || jiralink === undefined) {
            window.location.href = "chrome-extension://oomagoephlkmjnihcoladahhnokjagkc/options.html";
        }
        this.addJiraLink(jiralink);
    }, 5000, jiralink)
});

function addJiraLink(jiralink) {
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
        var href = jiralink + $(clientRefrenceInput).val();
        var jiraLink = $('<a></a>').attr("href", href).append('<h3>Jirq Link</h3>');

        $(contanierDiv).append(jiraLink);
    }
}

const toPromise = (callback) => {
    const promise = new Promise((resolve, reject) => {
        try {
            callback(resolve, reject);
        }
        catch (err) {
            reject(err);
        }
    });
    return promise;
}
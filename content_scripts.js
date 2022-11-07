const FILED_LABEL = 'client reference';
const LINK_BACKSLASH = '/';
const options = {};

const getOptionsFromStorageAsync = getAllStorageLocalData().then(items => {
    Object.assign(options, items);
})

const openOptionPage = function () {
    chrome.runtime.sendMessage('showOptions');
    return false;
}

$(window).bind("load", async function () {

    await getOptionsFromStorageAsync;

    if (options.jiraLink === '' || options.jiraLink === undefined) {
        return openOptionPage();
    }

    setTimeout(function () {
        this.addJiraLinkToAzurePlanningSection(options.jiraLink);
    }, 5000, options.jiraLink)
});

function addJiraLinkToAzurePlanningSection(jiraLink) {
    const wrapper = $('.wrapping-container').find('.section2 .grid-group');
    const container = wrapper.find('.tfs-collapsible-content')
    const controlCollection = wrapper.find('.control');

    const clientReferenceInputController = controlCollection.filter(function (index, control) {
        let label = $(control).find('label').text();
        if (label.indexOf(FILED_LABEL) >= 0) {
            return true;
        }
    });

    const clientReferenceInput = clientReferenceInputController.find('input')
    if (jiraLink.endsWith(LINK_BACKSLASH) === false) {
        jiraLink = jiraLink + LINK_BACKSLASH
    }

    const href = jiraLink + $(clientReferenceInput).val();
    const jiraLinkTag = $('<a></a>')
        .attr('href', href)
        .attr('target', '_blank')
        .attr('rel', 'noopener noreferrer')
        .append('<h3>JIRA Link</h3>');

    if ($(clientReferenceInput).val() !== '') {
        $(container).append(jiraLinkTag);
    }
}

function getAllStorageLocalData() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(null, (items) => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            resolve(items);
        });
    });
}
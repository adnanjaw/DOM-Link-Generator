const LINK_BACKSLASH = '/';
const options = {};

const getOptionsFromStorageAsync = getAllStorageLocalData().then(items => {
    Object.assign(options, items);
})

$(window).on('load', async function () {
    await getOptionsFromStorageAsync;

    if ($.isEmptyObject(options) === true) {
        return;
    }

    setTimeout(function () {
        createDynamicLinksFromOptions(options.dynamicLinkCollection);
        createStaticLinksFromOptions(options.staticLinkCollection);
    }, 5000, options)
});

function createStaticLinksFromOptions(staticLinkCollection) {
    $.each(staticLinkCollection, function (index, staticLink) {
        addStaticLinkToAzurePlanningSection(staticLink);
    });
}

function createDynamicLinksFromOptions(dynamicLinkCollection) {
    $.each(dynamicLinkCollection, function (index, dynamicLink) {
        addDynamicLinkToAzurePlanningSection(dynamicLink);
    });
}


function addDynamicLinkToAzurePlanningSection(dynamicLink) {
    const wrapper = $('.wrapping-container').find('.section2 .grid-group');
    const container = wrapper.find('.tfs-collapsible-content').eq(0);
    const controlCollection = wrapper.find('.control');

    const inputController = controlCollection.filter(function (index, control) {
        const label = $(control).find('label').text().toLowerCase();
        const fieldName = dynamicLink.azureField.toLowerCase();
        if (label.includes(fieldName) === true) {
            return true;
        }
    });

    const input = inputController.find('input')
    let url = validateUrl(dynamicLink.url);

    const href = url + $(input).val();
    const dynamicLinkTag = $('<a></a>')
        .attr('href', href)
        .attr('target', '_blank')
        .attr('rel', 'noopener noreferrer')
        .append(`<h3>${dynamicLink.name}</h3>`);

    if ($(input).val() !== '') {
        $(container).append(dynamicLinkTag);
    }
}


function addStaticLinkToAzurePlanningSection(staticLink) {
    const wrapper = $('.wrapping-container').find('.section2 .grid-group');
    const container = wrapper.find('.tfs-collapsible-content').eq(0);
    let href = validateUrl(staticLink.url);


    const staticLinkTag = $('<a></a>')
        .attr('href', href)
        .attr('target', '_blank')
        .attr('rel', 'noopener noreferrer')
        .append(`<h3>${staticLink.name}</h3>`);

    $(container).append(staticLinkTag);
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

function validateUrl(url) {
    if (url.endsWith(LINK_BACKSLASH) === false) {
        url = url + LINK_BACKSLASH
    }

    return url;
}
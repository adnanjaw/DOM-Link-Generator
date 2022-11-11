const LINK_BACKSLASH = '/';
const options = {};

$(document).on('click', 'a', async function () {
    await loadLinks();
});

$(async function () {
    await loadLinks();
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

const getOptionsFromStorageAsync = getAllStorageLocalData().then(items => {
    Object.assign(options, items);
})

function addDynamicLinkToAzurePlanningSection(dynamicLink) {
    const wrapper = $('.wrapping-container').find('.section2 .grid-group');
    const container = wrapper.find('.tfs-collapsible-content').eq(0);
    const controlCollection = wrapper.find('.control');
    const linkContainer = container.find('#links-container');

    const inputController = controlCollection.filter(function (index, control) {
        const label = $(control).find('label').text().toLowerCase();
        const fieldName = dynamicLink.azureField.toLowerCase();
        if (label.includes(fieldName) === true) {
            return true;
        }
    });

    const input = inputController.find('input')
    const url = validateUrl(dynamicLink.url);

    const inputValue = $(input).val();

    if (inputValue === '') {
        return;
    }

    $.each(inputValue.split(','), function (index, value) {
        if ($.trim(value) === '') {
            return;
        }

        const href = url + $.trim(value);
        const dynamicLinkTag = getLinkTag(href, dynamicLink);

        if ($(input).val() !== '') {
            $(linkContainer).append(dynamicLinkTag);
        }
    });
}

function addStaticLinkToAzurePlanningSection(staticLink) {
    const wrapper = $('.wrapping-container').find('.section2 .grid-group');
    const container = wrapper.find('.tfs-collapsible-content').eq(0);
    const linkContainer = container.find('#links-container');

    const href = validateUrl(staticLink.url);
    const staticLinkTag = getLinkTag(href, staticLink);

    $(linkContainer).append(staticLinkTag);
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

function getLinkTag(href, link) {
    return $('<a></a>')
        .attr('href', href)
        .attr('target', '_blank')
        .attr('rel', 'noopener noreferrer')
        .append(`<h3>${link.name}</h3>`);
}

function validateUrl(url) {
    if (url.endsWith(LINK_BACKSLASH) === false) {
        url = url + LINK_BACKSLASH
    }

    return url;
}

async function loadLinks() {
    await getOptionsFromStorageAsync;

    if ($.isEmptyObject(options) === true) {
        return;
    }

    waitUntilPlanningSectionIsVisible().then(function () {
        createDynamicLinksFromOptions(options.dynamicLinkCollection);
        createStaticLinksFromOptions(options.staticLinkCollection);
    });
}

const waitUntilPlanningSectionIsVisible = function () {
    return new Promise(function (callback) {
        let tryCount = 100;
        function checkAndWait() {
            if (tryCount <= 0) {
                return;
            }

            const wrapper = $('.wrapping-container').find('.section2 .grid-group');
            const container = wrapper.find('.tfs-collapsible-content').eq(0);
            if (container.length > 0) {
                const linkContainer = container.find('#links-container');
                if (linkContainer.length === 0) {
                    $('<div id="links-container"></div>').appendTo(container);
                }
                linkContainer.empty();
                callback(container);
            } else {
                checkIfVisible();
            }
        }

        function checkIfVisible() {
            setTimeout(checkAndWait, 100, --tryCount);
        }

        checkIfVisible();
    });
};
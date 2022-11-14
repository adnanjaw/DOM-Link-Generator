import $ from 'jquery'
import {StorageService} from "./service/storage-service";

const storageService = new StorageService();
const LINK_BACKSLASH: string = '/';
const options: any = {};

$(document).on('click', 'a', async function () {
    await loadLinks();
});

$(async function () {
    await loadLinks();
});

function createStaticLinksFromOptions(staticLinkCollection: Object) {
    $.each(staticLinkCollection, function (index, staticLink) {
        addStaticLinkToAzurePlanningSection(staticLink);
    });
}

function createDynamicLinksFromOptions(dynamicLinkCollection: Object) {
    $.each(dynamicLinkCollection, function (index, dynamicLink) {
        addDynamicLinkToAzurePlanningSection(dynamicLink);
    });
}

const getOptionsFromStorageAsync = storageService.getAllStorageLocalData().then(items => {
    Object.assign(options, items);
})

async function loadLinks() {
    await getOptionsFromStorageAsync;

    if (isEmpty(options)) {
        return;
    }

    waitUntilPlanningSectionIsVisible().then(function () {
        createDynamicLinksFromOptions(options.dynamicLinkCollection);
        createStaticLinksFromOptions(options.staticLinkCollection);
    });
}


function isEmpty(obj: Record<string, any>): boolean {
    return Object.keys(obj).length === 0;
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

function addDynamicLinkToAzurePlanningSection(dynamicLink: any) {
    const wrapper = $('.wrapping-container').find('.section2 .grid-group');
    const container = wrapper.find('.tfs-collapsible-content').eq(0);
    const controlCollection = wrapper.find('.control');
    const linkContainer = container.find('#links-container');

    const inputController = controlCollection.filter((index: number, control: any): boolean => {
        const label = $(control).find('label').text().toLowerCase();
        const fieldName = dynamicLink.azureField.toLowerCase();
        return label.includes(fieldName);
    });

    const input = inputController.find('input')
    const url = validateUrl(dynamicLink.url);

    const inputValue: any = $(input).val();

    if (inputValue === '') {
        return;
    }

    $.each(inputValue.split(','), function (index, value) {
        if (value.trim() === '') {
            return;
        }

        const href = url + value.trim();
        const dynamicLinkTag = getLinkTag(href, dynamicLink, value);

        if ($(input).val() !== '') {
            $(linkContainer).append(dynamicLinkTag);
        }
    });
}

function addStaticLinkToAzurePlanningSection(staticLink: any) {
    const wrapper = $('.wrapping-container').find('.section2 .grid-group');
    const container = wrapper.find('.tfs-collapsible-content').eq(0);
    const linkContainer = container.find('#links-container');

    const href = validateUrl(staticLink.url);
    const staticLinkTag = getLinkTag(href, staticLink, '');

    $(linkContainer).append(staticLinkTag);
}

function getLinkTag(href: string, link: any, value: string) {
    let h3 = `<h3>${link.name}</h3>`
    if (value.length > 0) {
        h3 = `<h3>${link.name} (${value.trim()})</h3>`
    }
    return $('<a></a>')
        .attr('href', href)
        .attr('target', '_blank')
        .attr('rel', 'noopener noreferrer')
        .append(h3);
}

function validateUrl(url: string) {
    if (!url.endsWith(LINK_BACKSLASH)) {
        url = url + LINK_BACKSLASH
    }

    return url;
}
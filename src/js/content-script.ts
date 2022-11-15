import $ from 'jquery'
import {StorageService} from "./service/storage-service";
import {DynamicLink} from "./model/DynamicLink";
import {Link} from "./model/Link";
import {LinkHelper} from "./helper/link-helper";

const storageService = new StorageService();
const options: any = {
    'dynamicLinkCollection': [],
    'staticLinkCollection': []
};

$(document).on('click', 'a', async function () {
    await loadLinks();
});

$(window).on("load", async function () {
    await loadLinks();
});

function createStaticLinksFromOptions() {
    $.each(options.staticLinkCollection, function (index, staticLink) {
        addStaticLinkToAzurePlanningSection(Link.fromSerialized(staticLink));
    });
}

function createDynamicLinksFromOptions() {
    $.each(options.dynamicLinkCollection, function (index, dynamicLink) {
        addDynamicLinkToAzurePlanningSection(DynamicLink.fromSerialized(dynamicLink));
    });
}

const getOptionsFromStorageAsync = storageService.getAllStorageLocalData().then(items => {
    Object.assign(options, items);
})

async function loadLinks() {
    await getOptionsFromStorageAsync;

    if (LinkHelper.isEmpty(options)) {
        return;
    }

    waitUntilPlanningSectionIsVisible().then(function () {
        createDynamicLinksFromOptions();
        createStaticLinksFromOptions();
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

function addDynamicLinkToAzurePlanningSection(dynamicLink: DynamicLink) {
    const wrapper = $('.wrapping-container').find('.section2 .grid-group');
    const container = wrapper.find('.tfs-collapsible-content').eq(0);
    const controlCollection = wrapper.find('.control');
    const linkContainer = container.find('#links-container');

    const inputController = controlCollection.filter((index: number, control: any): boolean => {
        const label = $(control).find('label').text().toLowerCase();
        const fieldName = dynamicLink.azureFieldName.toLowerCase();
        return label.includes(fieldName);
    });

    const input = inputController.find('input')
    const inputValue: any = $(input).val();

    if (inputValue === '') {
        return;
    }

    $.each(inputValue.split(','), function (index: number, value: string) {
        const cleanValue = value.trim();
        if (cleanValue === '') {
            return;
        }

        const dynamicLinkTag = LinkHelper.createLinkTag(dynamicLink, cleanValue);

        if ($(input).val() !== '') {
            $(linkContainer).append(dynamicLinkTag);
        }
    });
}

function addStaticLinkToAzurePlanningSection(staticLink: Link) {
    const wrapper = $('.wrapping-container').find('.section2 .grid-group');
    const container = wrapper.find('.tfs-collapsible-content').eq(0);
    const linkContainer = container.find('#links-container');

    const staticLinkTag = LinkHelper.createLinkTag(staticLink);

    $(linkContainer).append(staticLinkTag);
}
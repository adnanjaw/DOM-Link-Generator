const options = {};

$(async function () {

    await getOptionsFromStorageAsync;

    await getDynamicLinksCollectionAsync();

    await getStaticLinksCollectionAsync();

    $('#dynamic-link-form').submit(async function (event) {

        await getOptionsFromStorageAsync;

        event.preventDefault();
        let dynamicLink = {
            name: $('#dynamic-link-name').val(),
            url: $('#dynamic-link-url').val(),
            azuerField: $('#dynamic-azuer-planning-field-title').val()
        }
        let dynamicLinkCollection = jQuery.isEmptyObject(options.dynamicLinkCollection) ? [] : options.dynamicLinkCollection;

        dynamicLinkCollection.push(dynamicLink);
        chrome.storage.local.set({ 'dynamicLinkCollection': dynamicLinkCollection }, () => {
            if (chrome.runtime.lastError)
                console.log('Error setting');
        });

        await getDynamicLinksCollectionAsync();

    });

    $('#static-link-form').submit(async function (event) {

        await getOptionsFromStorageAsync;

        event.preventDefault();
        let staticLink = {
            name: $('#static-link-name').val(),
            url: $('#static-link-url').val(),
        }
        let staticLinkCollection = jQuery.isEmptyObject(options.staticLinkCollection) ? [] : options.staticLinkCollection;

        staticLinkCollection.push(staticLink);
        chrome.storage.local.set({ 'staticLinkCollection': staticLinkCollection }, () => {
            if (chrome.runtime.lastError)
                console.log('Error setting');
        });

        await getStaticLinksCollectionAsync();

    });

})

const getOptionsFromStorageAsync = getAllStorageLocalData().then(items => {
    Object.assign(options, items);
});

async function getDynamicLinksCollectionAsync() {
    $("#dynamic-link-table").empty();
    $.each(options.dynamicLinkCollection, function (index, dynamicLink) {
        $('#dynamic-link-table').append(`<tr id="id-${++index}">
                <th scope="row">${index}</th>
                <td>${dynamicLink.name}</td>
                <td>${dynamicLink.url}</td>
                <td>${dynamicLink.azuerField}</td>
                <td>
                    <button type="button" class="btn btn-danger">Delete</button>
                </td>
            </tr>`);
    });
}

async function getStaticLinksCollectionAsync() {
    $("#static-link-table").empty();
    $.each(options.staticLinkCollection, function (index, staticLink) {
        $('#static-link-table').append(`<tr id="id-${++index}">
                <th scope="row">${index}</th>
                <td>${staticLink.name}</td>
                <td>${staticLink.url}</td>
                <td>
                    <button type="button" class="btn btn-danger">Delete</button>
                </td>
            </tr>`);
    });
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
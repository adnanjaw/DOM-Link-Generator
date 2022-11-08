const options = {};

$(async function () {

    await refreshTables();

    $(document).on('submit', '#dynamic-link-form', async function () {
        await getOptionsFromStorageAsync;

        const dynamicLink = {
            name: $('#dynamic-link-name').val(),
            url: $('#dynamic-link-url').val(),
            azureField: $('#dynamic-azure-planning-field-title').val()
        }
        let dynamicLinkCollection = $.isEmptyObject(options.dynamicLinkCollection) ? [] : options.dynamicLinkCollection;

        dynamicLinkCollection.push(dynamicLink);
        setStorageKey({'dynamicLinkCollection': dynamicLinkCollection})

        await refreshTables();
    });

    $(document).on('submit', '#static-link-form', async function () {
        await getOptionsFromStorageAsync;

        let staticLink = {
            name: $('#static-link-name').val(), url: $('#static-link-url').val(),
        }
        let staticLinkCollection = $.isEmptyObject(options.staticLinkCollection) ? [] : options.staticLinkCollection;

        staticLinkCollection.push(staticLink);
        setStorageKey({'staticLinkCollection': staticLinkCollection})

        await refreshTables();
    });

    $(document).on('click', '.deleteDynamicLink', function () {
        deleteDynamicLink($(this).data('id'));
    });

    $(document).on('click', '.deleteStaticLink', function () {
        deleteStaticLink($(this).data('id'));
    });

})

const getOptionsFromStorageAsync = getAllStorageLocalData().then(storageOptions => {
    Object.assign(options, storageOptions);
});

function addDynamicLinkRow(index, dynamicLink) {
    $('#dynamic-link-table').append(`<tr id="id-${++index}">
                <th scope="row">${index}</th>
                <td>${dynamicLink.name}</td>
                <td>${dynamicLink.url}</td>
                <td>${dynamicLink.azureField}</td>
                <td>
                    <button type="button" class="btn btn-danger deleteDynamicLink" data-id="${index - 1}">Delete</button>
                </td>
            </tr>`);
}

async function getDynamicLinksCollectionAsync() {
    $("#dynamic-link-table").empty();
    $.each(options.dynamicLinkCollection, function (index, dynamicLink) {
        addDynamicLinkRow(index, dynamicLink);
    });
}

async function getStaticLinksCollectionAsync() {
    $("#static-link-table").empty();
    $.each(options.staticLinkCollection, function (index, staticLink) {
        addStaticLinkRow(index, staticLink);
    });
}

function addStaticLinkRow(index, staticLink) {
    $('#static-link-table').append(`<tr id="id-${++index}">
                <th scope="row">${index}</th>
                <td>${staticLink.name}</td>
                <td>${staticLink.url}</td>
                <td>
                    <button type="button" class="btn btn-danger deleteStaticLink" data-id="${index - 1}">Delete</button>
                </td>
            </tr>`);
}

async function refreshTables() {
    await getOptionsFromStorageAsync;

    await getDynamicLinksCollectionAsync();

    await getStaticLinksCollectionAsync();
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

function setStorageKey(newKey) {
    chrome.storage.local.set(newKey, () => {
        if (chrome.runtime.lastError) {
            console.log('Error setting');
        }
    });
}

async function deleteDynamicLink(id) {
    console.log(id);
}

async function deleteStaticLink(id) {
    console.log(id);
}
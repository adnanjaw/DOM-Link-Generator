import $ from 'jquery';
import {StorageService} from "./service/storage-service";

const storageService = new StorageService();

const options: any = {};

$(async function () {
    await refreshTables();
    $(document).on('submit', '#dynamic-link-form', async function (event) {
        event.preventDefault();
        await getOptionsFromStorageAsync;

        const dynamicLink = {
            name: $('#dynamic-link-name').val(),
            url: $('#dynamic-link-url').val(),
            azureField: $('#dynamic-azure-planning-field-title').val()
        }
        let dynamicLinkCollection = $.isEmptyObject(options.dynamicLinkCollection) ? [] : options.dynamicLinkCollection;

        dynamicLinkCollection.push(dynamicLink);
        await storageService.setStorageKey({'dynamicLinkCollection': dynamicLinkCollection})

        await refreshTables();
    });

    $(document).on('submit', '#static-link-form', async function () {
        await getOptionsFromStorageAsync;

        let staticLink = {
            name: $('#static-link-name').val(), url: $('#static-link-url').val(),
        }
        let staticLinkCollection = $.isEmptyObject(options.staticLinkCollection) ? [] : options.staticLinkCollection;

        staticLinkCollection.push(staticLink);
        await storageService.setStorageKey({'staticLinkCollection': staticLinkCollection})

        await refreshTables();
    });

    $(document).on('click', '.deleteDynamicLink', function () {
        deleteDynamicLink($(this).data('id'));
    });

    $(document).on('click', '.deleteStaticLink', function () {
        deleteStaticLink($(this).data('id'));
    });

})

const getOptionsFromStorageAsync = storageService.getAllStorageLocalData().then(storageOptions => {
    Object.assign(options, storageOptions);
});

function addDynamicLinkRow(index: number, dynamicLink: any) {
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
    $.each(options.dynamicLinkCollection, function (index: number, dynamicLink) {
        addDynamicLinkRow(index, dynamicLink);
    });
}

async function getStaticLinksCollectionAsync() {
    $("#static-link-table").empty();
    $.each(options.staticLinkCollection, function (index: number, staticLink) {
        addStaticLinkRow(index, staticLink);
    });
}

function addStaticLinkRow(index: number, staticLink: any) {
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

async function deleteDynamicLink(id: number) {
    console.log(id);
    alert('coming soon...');
}

async function deleteStaticLink(id: number) {
    console.log(id);
    alert('coming soon...')
}
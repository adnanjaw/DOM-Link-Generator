$(function () {
    chrome.storage.local.get(['jiraLink', 'dynamicLink'], (result) => {
        if (chrome.runtime.lastError)
            console.log('Error getting');

        console.log(result);
        // $('#jira-link').val(result.jiraLink)


        // let rowIdx = 0;
        // $('#dynamic-link-table').append(`<tr id="id-${++rowIdx}">
        //         <th scope="row">${rowIdx}</th>
        //         <td>${result.dynamicLink.name}</td>
        //         <td>${result.dynamicLink.url}</td>
        //         <td>${result.dynamicLink.azuerField}</td>
        //         <td>
        //             <button type="button" class="btn btn-danger">Delete</button>
        //         </td>
        //     </tr>`);
    });

    $('#dynamic-link-form').submit(function (event) {
        event.preventDefault();
        let dynamicLink = {
            name: $('#dynamic-link-name').val(),
            url: $('#dynamic-link-url').val(),
            azuerField: $('#dynamic-azuer-planning-field-title').val()
        }
        let dynamicLinkCollection = [];
        dynamicLinkCollection.push(dynamicLink);
        chrome.storage.local.set({ 'dynamicLinkCollection': dynamicLinkCollection }, () => {
            if (chrome.runtime.lastError)
                console.log('Error setting');

            alert('New dynamic link is stored.');
            // close();
        });

    });


    // add jiraLink
    $('#jira-link-submit').click(function () {
        let jiraLink = $('#jira-link').val();
        if (jiraLink) {
            chrome.storage.local.set({ 'jiraLink': jiraLink }, () => {
                if (chrome.runtime.lastError)
                    console.log('Error setting');

                alert('jiraLink is stored');
                // close();
            });
        };
    })
})
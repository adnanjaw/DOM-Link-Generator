$(function () {
    chrome.storage.local.get(['jiraLink'], (result) => {
        if (chrome.runtime.lastError)
            console.log('Error getting');

        $('#jira-link').val(result.jiraLink)
    });


    // add jiraLink
    $('#jira-link-submit').click(function () {
        let jiraLink = $('#jira-link').val();
        if (jiraLink) {
            chrome.storage.local.set({ 'jiraLink': jiraLink }, () => {
                if (chrome.runtime.lastError)
                    console.log('Error setting');

                alert('jiraLink is stored');
                close();
            });
        };
    })
})
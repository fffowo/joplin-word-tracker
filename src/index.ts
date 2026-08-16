// Import the Joplin API
import joplin from 'api';


joplin.plugins.register({

    onStart: async function() {

        // Later, this is where you'll want to update the TOC
        async function updateTocView() {
            // Get the current note from the workspace.
            const note = await joplin.workspace.selectedNote();


            // Keep in mind that it can be `null` if nothing is currently selected!
            if (note) {
                // console.info('Note content has changed! New note is:', note);

				const body = note ? note.body.trim().escapeHtml() : 0;
				console.log('Note body:', body); // check the actual unformatted body 
				
				// TODO: formatting  
				// const words = body.split([' ']); // returns array 
				const words = body.split(/\s+/); // splits all whitespaces


				let counter = words.length; 

				console.log('Words:', counter);
				


				// TODO 
		        // Create the panel object
				const panel = await joplin.views.panels.create('panel_wordcount');
				let itemHtml = [];
				itemHtml.push(`
                        <p>
								Words: <b>${counter}</b>
                        </p>
                    `);

                // Finally, insert all the headers in a container and set the webview HTML:
                await joplin.views.panels.setHtml(panel, `
                    <div class="container">
                        ${itemHtml.join('\n')}
                    </div>
                `);

            } else {
                console.info('No note is selected');
            }
        }

        // This event will be triggered when the user selects a different note
        await joplin.workspace.onNoteSelectionChange(() => {
            updateTocView();
        });

        // This event will be triggered when the content of the note changes
        // as you also want to update the TOC in this case.
        await joplin.workspace.onNoteChange(() => {
            updateTocView();
        });

        // Also update the TOC when the plugin starts
        updateTocView();
    },

});

// From https://stackoverflow.com/a/6234804/561309
function escapeHtml(unsafe:string) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
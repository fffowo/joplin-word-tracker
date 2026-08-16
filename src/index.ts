// Import the Joplin API
import joplin from 'api';

joplin.plugins.register({

    onStart: async function() {

		// Create the panel object
		const panel = await joplin.views.panels.create('panel_wordcount');


        // Later, this is where you'll want to update the TOC
        async function updateTocView() {
            // Get the current note from the workspace.
            const note = await joplin.workspace.selectedNote();

			let counter = 0;

            // Keep in mind that it can be `null` if nothing is currently selected!
            if (note) {

				const body = note ? note.body.trim() : 0;
				console.log('Note body:', body); // check the actual unformatted body 
				
				// TODO: formatting  
				// const words = body.split([' ']); // returns array 
				const words = body.split(/\s+/); // splits all whitespaces


				let newCounter = words.length; 

				console.log('Words:', newCounter);


				// TODO 
				let itemHtml = [];
				itemHtml.push(`
								Words: <b>${newCounter}</b>
					`);

				// Finally, insert all the headers in a container and set the webview HTML:
				await joplin.views.panels.setHtml(panel, `
					<div class="container">
						${itemHtml.join('\n')}
					</div>
				`);



            } else {
                console.info('No note is selected');

				await joplin.views.panels.setHtml(panel, 'Please select a note to view the table of content');

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

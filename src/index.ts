// Import the Joplin API
import joplin from 'api';

joplin.plugins.register({

    onStart: async function() {

		// Create the panel object
		const panel = await joplin.views.panels.create('panel_wordcount');

        // Update the TOC
        async function updateTocView() {
            
            // Get the current note from the workspace.
            let note = await joplin.workspace.selectedNote();
            let body = getNoteBody(note);

            let counter = getWordCount(body);

            console.log('Words:', counter);

            if (note) {

                if (note != joplin.workspace.selectedNote()) {
                    note = await joplin.workspace.selectedNote();
                    body = getNoteBody(note);
                    counter = getWordCount(body);
                }

				// TODO 
				let itemHtml = [];
				itemHtml.push(`
								Words: <b>${counter}</b>
					`);

				// Finally, insert all the headers in a container and set the webview HTML:
				await joplin.views.panels.setHtml(panel, `
					<div class="container">
						${itemHtml.join('\n')}
					</div>
				`);
                // div class="spacer" unten
                // class="note-title-info-group" oben 


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

        await joplin.workspace.onResourceChange(() => {
            updateTocView();
        });

        // Also update the TOC when the plugin starts
        updateTocView();
    },

});

function getWordCount(noteBody: string): number {

    const words = noteBody.split(/\s+/); // splits all whitespaces

    return words.length; 
}

function getNoteBody(note: any): string {
    return note ? note.body.trim() : '';
}
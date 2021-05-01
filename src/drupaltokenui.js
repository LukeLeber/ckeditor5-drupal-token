import { Plugin } from "ckeditor5/src/core";
import { addListToDropdown, createDropdown } from "ckeditor5/src/ui";
import { Collection } from "ckeditor5/src/utils";
import { Model } from "ckeditor5/src/ui";

export default class DrupalTokenUI extends Plugin {
    init() {
        const editor = this.editor;
        const t = editor.t;
        const tokenNames = editor.config.get( 'drupalTokenConfig.types' );

        // The "token" dropdown must be registered among the UI components of the editor
        // to be displayed in the toolbar.
        editor.ui.componentFactory.add( 'drupalToken', locale => {
            const dropdownView = createDropdown( locale );

            // Populate the list in the dropdown with items.
            addListToDropdown( dropdownView, getDropdownItemsDefinitions( tokenNames ) );

            dropdownView.buttonView.set( {
                // The t() function helps localize the editor. All strings enclosed in t() can be
                // translated and change when the language of the editor changes.
                label: t( 'Insert token' ),
                tooltip: true,
                withText: true
            } );

            // Disable the token button when the command is disabled.
            const command = editor.commands.get( 'drupaltoken' );
            dropdownView.bind( 'isEnabled' ).to( command );

            // Execute the command when the dropdown item is clicked (executed).
            this.listenTo( dropdownView, 'execute', evt => {
                editor.execute( 'drupaltoken', { value: evt.source.commandParam } );
                editor.editing.view.focus();
            } );

            return dropdownView;
        } );
    }
}

function getDropdownItemsDefinitions( tokenNames ) {
    const itemDefinitions = new Collection();

    for ( const name of tokenNames ) {
        const definition = {
            type: 'button',
            model: new Model( {
                commandParam: name,
                label: name,
                withText: true
            } )
        };

        // Add the item definition to the collection.
        itemDefinitions.add( definition );
    }

    return itemDefinitions;
}

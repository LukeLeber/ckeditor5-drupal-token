/**
 * @module drupaltoken/drupaltokenui
 */

import { Plugin } from "ckeditor5/src/core";
import { addListToDropdown, createDropdown } from "ckeditor5/src/ui";
import { Collection } from "ckeditor5/src/utils";
import { Model } from "ckeditor5/src/ui";

/**
 * The drupaltoken UI plugin.
 *
 * @extends module:core/plugin~Plugin
 */
export default class DrupalTokenUI extends Plugin {

    /**
     * {@inheritDoc}
     */
    static get pluginName() {
        return 'DrupalTokenUI';
    }

    /**
     * {@inheritDoc}
     */
    init() {
        const editor = this.editor;
        const t = editor.t;
        const tokenNames = editor.config.get( 'drupalTokenConfig.types' );

        editor.ui.componentFactory.add( 'drupalToken', locale => {
            const dropdownView = createDropdown( locale );

            addListToDropdown( dropdownView, getDropdownItemsDefinitions( tokenNames ) );

            dropdownView.buttonView.set( {
                label: t( 'Insert token' ),
                tooltip: true,
                withText: true
            } );

            const command = editor.commands.get( 'insertDrupalToken' );
            dropdownView.bind( 'isEnabled' ).to( command );

            this.listenTo( dropdownView, 'execute', evt => {
                editor.execute( 'insertDrupalToken', { value: evt.source.commandParam } );
                editor.editing.view.focus();
            } );

            return dropdownView;
        } );
    }
}

/**
 * Transforms the provided token names into an item definitions collection.
 *
 * @param tokenNames
 * @returns {Collection}
 */
function getDropdownItemsDefinitions( tokenNames ) {
    const itemDefinitions = new Collection();

    for ( const name of tokenNames ) {
        itemDefinitions.add({
            type: 'button',
            model: new Model( {
                commandParam: name,
                label: name,
                withText: true
            } )
        });
    }

    return itemDefinitions;
}

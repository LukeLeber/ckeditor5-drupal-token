/**
 * @module drupaltoken/drupaltokenui
 */

import { Plugin } from 'ckeditor5/src/core';
import { ButtonView } from 'ckeditor5/src/ui';
import { Collection } from 'ckeditor5/src/utils';
import { Model } from 'ckeditor5/src/ui';
import tokenIcon from '../theme/icons/token.svg';

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
        const options = editor.config.get( 'drupalToken' );
        if (!options) {
          return;
        }

        const { tokenBrowserURL, openDialog, dialogSettings = {} } = options;
        if (!tokenBrowserURL || typeof openDialog !== 'function') {
            return;
        }

        editor.ui.componentFactory.add( 'drupalToken', locale => {
            const buttonView = new ButtonView(locale);
            buttonView.set({
              label: editor.t('Insert Drupal Token'),
              icon: tokenIcon,
              tooltip: true
            });
            const command = editor.commands.get( 'insertDrupalToken' );
            buttonView.bind('isOn', 'isEnabled').to(command, 'value', 'isEnabled');

            this.listenTo( buttonView, 'execute', evt => {
                editor.editing.view.focus();
                openDialog(
                  tokenBrowserURL,
                  ({attributes}) => {
                    editor.execute('insertDrupalToken', attributes);
                  },
                  dialogSettings,
                );
            } );

            return buttonView;
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

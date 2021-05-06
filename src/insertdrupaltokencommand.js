/**
 * @module drupaltoken/drupaltokencommand
 */

import { Command } from "ckeditor5/src/core";

/**
 * The drupal token command.  It is used to inject a token.
 *
 * @extends module:core/command~Command
 */
export default class InsertDrupalTokenCommand extends Command {

    /**
     * Executes the command.
     *
     *		editor.execute( 'drupalToken', 'token_name' );
     *
     * @param {String} value The name of the token to insert.
     * {@link module:drupaltoken/drupaltoken~DrupalTokenConfig#tokens `drupaltoken.tokens`} configuration option).
     * @fires execute
     */
    execute( { value } ) {
        const editor = this.editor;
        const selection = editor.model.document.selection;

        editor.model.change( writer => {
            const token = writer.createElement( 'drupaltoken', {
                ...Object.fromEntries( selection.getAttributes() ),
                name: value
            } );
            editor.model.insertContent( token );
            writer.setSelection( token, 'on' );
        } );
    }

    /**
     * @inheritDoc
     */
    refresh() {
        const model = this.editor.model;
        const selection = model.document.selection;

        this.isEnabled = model.schema.checkChild( selection.focus.parent, 'drupaltoken' );
    }
}

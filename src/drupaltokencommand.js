import { Command } from "ckeditor5/src/core";

export default class DrupalTokenCommand extends Command {
    execute( { value } ) {
        const editor = this.editor;
        const selection = editor.model.document.selection;

        editor.model.change( writer => {
            // Create a <token> elment with the "name" attribute (and all the selection attributes)...
            const token = writer.createElement( 'drupaltoken', {
                ...Object.fromEntries( selection.getAttributes() ),
                name: value
            } );

            // ... and insert it into the document.
            editor.model.insertContent( token );

            // Put the selection on the inserted element.
            writer.setSelection( token, 'on' );
        } );
    }

    refresh() {
        const model = this.editor.model;
        const selection = model.document.selection;

        this.isEnabled = model.schema.checkChild( selection.focus.parent, 'drupaltoken' );
    }
}

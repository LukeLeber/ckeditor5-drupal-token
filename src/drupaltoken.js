import { Plugin } from "ckeditor5/src/core";

import DrupalTokenEditing from './drupaltokenediting';
import DrupalTokenUI from './drupaltokenui';

export default class DrupalToken extends Plugin {
    static get requires() {
        return [ DrupalTokenEditing, DrupalTokenUI ];
    }
}

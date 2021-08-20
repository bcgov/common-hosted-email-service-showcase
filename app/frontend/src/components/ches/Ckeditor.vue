<template>
  <CKEditor
    :editor="editor"
    :config="editorConfig"
    :value="value"
    @input="$emit('update:value', $event)"
  />
</template>

<script>
import CKEditor from '@ckeditor/ckeditor5-vue2';

// building our own from src (to include exta buttons like 'view source'):
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import EssentialsPlugin from '@ckeditor/ckeditor5-essentials/src/essentials';
import SourceEditingPlugin from '@ckeditor/ckeditor5-source-editing/src/sourceediting';
import BoldPlugin from '@ckeditor/ckeditor5-basic-styles/src/bold';
import ItalicPlugin from '@ckeditor/ckeditor5-basic-styles/src/italic';
import LinkPlugin from '@ckeditor/ckeditor5-link/src/link';
import ParagraphPlugin from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import TableProperties from '@ckeditor/ckeditor5-table/src/tableproperties';
import TableCellProperties from '@ckeditor/ckeditor5-table/src/tablecellproperties';

export default {
  name: 'Ckeditor',
  components: {
    CKEditor: CKEditor.component,
  },

  props: {
    value: String,
  },

  data: () => ({
    // Essentials, Paragraph, Bold, Italic, SourceEditing,
    editor: ClassicEditor,
    editorConfig: {
      plugins: [
        EssentialsPlugin,
        BoldPlugin,
        ItalicPlugin,
        LinkPlugin,
        ParagraphPlugin,
        SourceEditingPlugin,
        Table,
        TableToolbar,
        TableProperties,
        TableCellProperties
      ],
      toolbar: {
        items: ['italic', 'bold', 'insertTable', '|', 'undo', 'redo', '|', 'sourceEditing'],
      },
      table: {
        contentToolbar: [
          'tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties'
        ]
      }
    },
  }),

};
</script>

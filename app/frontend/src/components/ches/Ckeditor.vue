<template>
  <div class="bodyDiv">
    <ckeditor
      :editor="editor"
      :config="editorConfig"
      :value="value"
      @input="$emit('update:value', $event)"
    ></ckeditor>
  </div>
</template>

<script>
import CKEditor from '@ckeditor/ckeditor5-vue2';
// if using classic build:
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import SourceEditing from '@ckeditor/ckeditor5-source-editing';

// if building our own from src (to include exta buttons like 'view source'):
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import EssentialsPlugin from '@ckeditor/ckeditor5-essentials/src/essentials';
import SourceEditingPlugin from '@ckeditor/ckeditor5-source-editing/src/sourceediting';
import BoldPlugin from '@ckeditor/ckeditor5-basic-styles/src/bold';
import ItalicPlugin from '@ckeditor/ckeditor5-basic-styles/src/italic';
import LinkPlugin from '@ckeditor/ckeditor5-link/src/link';
import ParagraphPlugin from '@ckeditor/ckeditor5-paragraph/src/paragraph';

export default {
  name: 'Ckeditor',
  components: {
    ckeditor: CKEditor.component,
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
      ],
      toolbar: {
        items: ['bold', 'italic', '|', 'undo', 'redo', '|', 'sourceEditing'],
      },
    },
  }),

};
</script>

<style scoped lang="scss">
/* give wysiwyg editor a min height */
.bodyDiv ::v-deep .ck-editor__editable {
  min-height: 180px;
}
</style>

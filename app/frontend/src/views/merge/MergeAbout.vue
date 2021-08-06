<template>
  <div>
    <v-container class="px-0 mt-8">
      <v-row>
        <v-col cols="12">
          <h3 class="mb-4">CHES Showcase - Mail Merge</h3>
          <p>The Mail Merge page demonstrates the email merge and templating capabilites of CHES. CHES supports
            sending a list of recipients (to, cc, bcc) a templated Subject and body. This allows an application to
            send personalized emails in batch mode.</p>

          <p>To showcase CHES, we have added some nice features to turn an Excel spreadsheet or CVS file into a
            CHES Mail Merge request. See below for some sample data and a template you can use as a guide to
            creating your own data and templates. It is advised that you fix the data in your spreadsheet and not
            in the JSON editor.
          </p>
          <p>
            The Excel spreadsheet/CVS file parser does best guesses on dates and times, it cannot parse and understand all
            formats.  If you encounter difficulties with dates and times from Excel, ensure your date and time stamp columns
            are formatted properly (&quot;Short Date&quot;, &quot;Long Date&quot; or &quot;Custom yyyy-mm-dd h:mm&quot; not
            &quot;General&quot;), or convert your sheet to CSV and format your dates to &quot;yyyy-mm-dd&quot; and time
            stamps to &quot;yyyy-mm-dd h:mm&quot;.
          </p>

          <ul class="mb-4">
            <li>
              <a href="/docs/mssc-ches-merge-example.csv" download="mssc-ches-merge-example-csv.csv">example csv</a>
            </li>
            <li>
              <a href="/docs/mssc-ches-merge-example.xlsx" download="mssc-ches-merge-example-excel.xlsx">example xlsx</a>
            </li>
            <li>
              <a href="/docs/mssc-ches-merge-example.txt" download="mssc-ches-merge-example-template.txt">example html template</a>
            </li>
          </ul>

          <h4 class="my-2">Guide</h4>
          <ol class="mb-4">
            <li>Download the two examples.</li>
            <li>One the merge screen, click the Excel button, and upload the CSV file.</li>
            <li>Review the contents of the table</li>
            <li>Click the JSON button and review the contents - this the context list sent to CHES</li>
            <li>For the body, click the HTML button to bring up the editor, then click View, click Source Code.
            </li>
            <li>Paste the contents of the example html template into the Source Code view and Save.</li>
            <li>For the Subject, enter <span v-pre>&quot;ATTN&#58; &#123;&#123;scope&#125;&#125;&#33;&quot;</span></li>
            <li>Click Preview</li>
          </ol>

          <h4 class="my-2">Notes</h4>
          <ul class="mb-4">
            <li>Review the csv file and look over the Excel table headings. Note that MSSC has
              removed &quot;bad&quot; characters (CHES accepts only underscore and alphanumeric characters for
              context variable names).
            </li>
            <li>Also note the last 5 columns: to, cc, bcc, tag, and delayTs. The naming of these columns is
              important (not their location in the file). These are special fields that are part of building the
              message, but are not used in the context (what populates each body and subject template).
            </li>
            <li>To is required. It can be a comma-separated list of email addresses.</li>
            <li>Cc and Bcc are not required. They can be comma-separated lists of email addresses.</li>
            <li>Tag can be used the help group messages and make it easier to search for them in CHES (for
              example, to determine status)
            </li>
            <li>Delay TS is a timestamp of when to deliver the message. Leave empty if you wish to deliver now.
            </li>
            <li>Any other field that contains a date, the Excel parser will translate to YYYY-MM-DD. Look in the
              csv file to see various formats it can translate from CSV. <strong>Note:</strong> the last line in the CSV
              has date formats that cannot be converted.
            </li>
            <li>If a field contains a date and time, and ends with ts (see endDateTs), MSSC will translate to
              YYYY-MM-DD hh:mm. This is local time.
            </li>
            <li>Note that delayTs appears in the JSON as a number. This is the date and time as milliseconds in
              UTC. This is what CHES expects.
            </li>
            <li>Also, note down the left hand side of the body is a listing of the variables you can use in the
              template. These are the CSV headings (altered if needed by MSSC)
            </li>
            <li>In Preview, you can navigate through all the messages that will be delivered.</li>
            <li><strong>Important:</strong> If you alter the JSON, the Excel data table will go away. This is a
              one way operation (excel to JSON).
            </li>
          </ul>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'MergeAbout',
  components: {},
};
</script>

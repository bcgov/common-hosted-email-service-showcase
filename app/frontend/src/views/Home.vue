<template>
  <v-container>
    <h1 class="my-6 text-center">Welcome to CHES Showcase</h1>
    <p>
      We provide API access for the
      <a
        href="https://bcgov.github.io/common-service-showcase/services/ches.html"
        target="_blank"
      >Common Hosted Email Service</a>.<br />
      This showcase demonstrates how an application can have messaging
      functionality by calling the API.
    </p>

    <h3 class="my-5">Demonstrated Capabilities</h3>
    <ul class="mb-10">
      <li>
        Converts xlsx or csv into a valid JSON format for CHES template
        endpoints
      </li>
      <li>Converts email attachments to base64 encoded</li>
      <li>Email form with field validation</li>
      <li>Mail merge form with field validation</li>
      <li>HTML editor</li>
      <li>Attachment Dropzone</li>
      <li>Mail merge preview</li>
      <li>Template creation assistance with a list of variables</li>
      <li>Keycloak login and roles</li>
    </ul>

    <h3 class="mb-5">What can the Common Hosted Email Service (CHES) do?</h3>
    <ul class="mb-10">
      <li>Send Email</li>
      <li>
        Schedule emails to be sent at a specified date and timeon the future
      </li>
      <li>Check the status of email</li>
      <li>Cancel or promote (force send) scheduled emails</li>
      <li>Bulk send email with mail merge templates</li>
      <li>Validate and preview emails created from mail merge templates</li>
    </ul>
  </v-container>
</template>

<script>
export default {
  name: 'Home',
  components: {},
};
</script>

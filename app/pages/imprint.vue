<script setup lang="ts">
useSeoMeta({
  title: 'Imprint',
  ogTitle: 'Imprint',
  description: 'Legal disclosure and contact information.',
  ogDescription: 'Legal disclosure and contact information.'
})
</script>

<template>
  <UPage>
    <UPageHero
      title="Imprint"
      description="Legal disclosure and contact information."
    />

    <UPageSection :ui="{ container: '!pt-0' }">
      <div class="prose prose-invert max-w-3xl">

        <h3>Responsible for Content</h3>
        <p>
          Viana Kalversberg<br>
          Oskar-von-Miller-Ring 20<br>
          80333 Munich<br>
          Germany<br>
          <br>
        </p>

        <h3>Contact</h3>
        <p>
          Email: viana@kalversberg.com<br>
          <br>
        </p>

        <h3>Disclaimer</h3>
        <p>
          The information on this website is provided without warranty of any
          kind. Links to external websites are provided for convenience; I have
          no control over their content and assume no responsibility for it.
        </p>
      </div>
    </UPageSection>
  </UPage>
  
</template>


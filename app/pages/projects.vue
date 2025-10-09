<script setup lang="ts">
const { data: page } = await useAsyncData('projects-page', () => {
  return queryCollection('pages').path('/projects').first()
})
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}

const { data: projects } = await useAsyncData('projects', () => {
  return queryCollection('projects').all()
})

const { global } = useAppConfig()

const formatProjectPeriod = (project: any) => {
  try {
    if (project?.startDate) {
      const startYear = new Date(project.startDate).getFullYear()
      const endYear = project.endDate ? new Date(project.endDate).getFullYear() : 'Present'
      return `${startYear}–${endYear}`
    }
    if (project?.date) {
      return String(new Date(project.date).getFullYear())
    }
  } catch {}
  return ''
}

const isGif = (src?: string | null): boolean => typeof src === 'string' && src.toLowerCase().endsWith('.gif')
const isPdf = (src?: string | null): boolean => typeof src === 'string' && src.toLowerCase().endsWith('.pdf')

useSeoMeta({
  title: page.value?.seo?.title || page.value?.title,
  ogTitle: page.value?.seo?.title || page.value?.title,
  description: page.value?.seo?.description || page.value?.description,
  ogDescription: page.value?.seo?.description || page.value?.description
})
</script>

<template>
  <UPage v-if="page">
    <UPageHero
      :title="page.title"
      :description="page.description"
      :links="page.links"
      :ui="{
        title: '!mx-0 text-left',
        description: '!mx-0 text-left',
        links: 'justify-start'
      }"
    >
    </UPageHero>
    <UPageSection
      :ui="{
        container: '!pt-0'
      }"
    >
      <Motion
        v-for="(project, index) in projects"
        :key="project.title"
        :initial="{ opacity: 0, transform: 'translateY(10px)' }"
        :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
        :transition="{ delay: 0.2 * index }"
        :in-view-options="{ once: true }"
      >
        <UPageCard
          :title="project.title"
          orientation="horizontal"
          variant="naked"
          :reverse="index % 2 === 1"
          class="group"
          :ui="{
            wrapper: 'max-sm:order-last'
          }"
        >
          <template #description>
            <MDC :value="project.description" unwrap="p" />
          </template>
          <template #leading>
            <span class="text-sm text-muted">
              {{ formatProjectPeriod(project) }}
            </span>
          </template>
          <template #footer>
            <ULink
              :to="project.url"
              class="text-sm text-primary flex items-center"
            >
              View Project
              <UIcon
                name="i-lucide-arrow-right"
                class="size-4 text-primary transition-all opacity-0 group-hover:translate-x-1 group-hover:opacity-100"
              />
            </ULink>
          </template>
          <div class="w-full h-48 bg-default rounded-lg overflow-hidden flex items-center justify-center">
            <video
              v-if="project.video"
              :src="project.video"
              controls
              loop
              muted
              playsinline
              class="h-full w-full object-contain"
            ></video>
            <object
              v-else-if="project.image && isPdf(project.image)"
              :data="project.image"
              type="application/pdf"
              class="h-full w-full"
            >
              <div class="flex flex-col items-center justify-center gap-2 p-4 text-center text-muted text-sm">
                <span>PDF preview unavailable.</span>
                <ULink
                  :to="project.image"
                  target="_blank"
                  class="text-primary underline underline-offset-2"
                >
                  Open PDF
                </ULink>
              </div>
            </object>
            <NuxtImg
              v-else-if="project.image"
              :src="project.image"
              :alt="project.title"
              class="max-w-full max-h-full object-contain"
              :format="isGif(project.image) ? undefined : 'webp'"
              sizes="sm:100vw md:800px lg:1000px"
              :placeholder="25"
            />
            <span
              v-else
              class="text-muted text-sm"
            >
              Preview coming soon
            </span>
          </div>
        </UPageCard>
      </Motion>
    </UPageSection>
  </UPage>
</template>

<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

defineProps<{
  page: IndexCollectionItem
}>()

const { data: projects } = await useAsyncData('projects', () => {
  return queryCollection('projects').all()
})

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
</script>

<template>
  <UPageSection
    :title="page.projects.title"
    :ui="{
      container: 'px-0 !pt-0 sm:gap-6 lg:gap-8',
      wrapper: 'mb-4',
      title: 'text-center text-xl sm:text-xl lg:text-2xl font-medium',
      description: 'text-center mt-2 text-pretty max-w-none text-sm sm:text-md lg:text-sm text-muted'
    }"
  >
    <template #description>
      <MDC :value="page.projects.description" unwrap="p" />
    </template>
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
            <NuxtImg
              :src="project.image"
              :alt="project.title"
              class="max-w-full max-h-full object-contain"
              format="webp"
              sizes="sm:100vw md:800px lg:1000px"
              :placeholder="25"
            />
          </div>
        </UPageCard>
      </Motion>
    </UPageSection>
  </UPageSection>
</template>

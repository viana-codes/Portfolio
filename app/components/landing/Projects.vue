<script setup lang="ts">
import { computed } from 'vue'
import type { IndexCollectionItem } from '@nuxt/content'

defineProps<{
  page: IndexCollectionItem
}>()

const { data: projects } = await useAsyncData('projects', () => {
  return queryCollection('projects').all()
})

const uniqueTechStack = computed(() => {
  const items: Array<{
    key: string
    icon?: string
    logo?: string
    label?: string
    color?: string
  }> = []
  const seen = new Set<string>()

  for (const project of projects.value ?? []) {
    for (const tech of project?.techStack ?? []) {
      if (!tech) {
        continue
      }
      const key = tech.icon || tech.logo || tech.label
      if (!key || seen.has(key)) {
        continue
      }
      seen.add(key)
      items.push({ key, ...tech })
    }
  }

  return items
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
      <div
        v-if="uniqueTechStack.length"
        class="mt-2 flex flex-wrap items-center justify-center gap-2"
      >
        <span
          v-for="tech in uniqueTechStack"
          :key="tech.key"
          class="inline-flex items-center gap-2 rounded-full bg-muted px-2.5 py-1 text-xs font-medium"
        >
          <UIcon
            v-if="tech.icon"
            :name="tech.icon"
            class="h-4 w-4"
            aria-hidden="true"
            :style="tech.color ? { color: tech.color } : undefined"
          />
          <NuxtImg
            v-else-if="tech.logo"
            :src="tech.logo"
            width="16"
            height="16"
            class="h-4 w-4 object-contain"
            alt=""
            aria-hidden="true"
          />
          <span class="text-muted">
            {{ tech.label ?? tech.key }}
          </span>
        </span>
      </div>
      <MDC
        v-else
        :value="page.projects.description"
        unwrap="p"
      />
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
            <div class="flex flex-col gap-3">
              <div
                v-if="project?.techStack?.length"
                class="flex flex-wrap items-center gap-2"
              >
                <span
                  v-for="tech in project.techStack"
                  :key="tech.label"
                  class="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium"
                >
                  <UIcon
                    v-if="tech.icon"
                    :name="tech.icon"
                    class="h-4 w-4"
                    aria-hidden="true"
                    :style="tech.color ? { color: tech.color } : undefined"
                  />
                  <NuxtImg
                    v-else-if="tech.logo"
                    :src="tech.logo"
                    width="16"
                    height="16"
                    class="h-4 w-4 object-contain"
                    alt=""
                    aria-hidden="true"
                  />
                  <span class="text-muted">
                    {{ tech.label }}
                  </span>
                </span>
              </div>
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
            </div>
          </template>
          <div class="w-full h-60 sm:h-64 lg:h-72 bg-default rounded-lg overflow-hidden flex items-center justify-center">
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
